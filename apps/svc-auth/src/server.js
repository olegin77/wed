import http from "node:http";

import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { __internal as jwtInternal, signJwt } from "../../../packages/auth/jwt.js";
import { hashPassword, verifyPassword } from "../../../packages/auth/password.js";
import { applySecurityHeaders } from "../../../packages/security/headers.js";

const prisma = new PrismaClient();

const DEFAULT_COOKIE_NAME = "wt_access";
const ALLOWED_ROLES = new Set(["PAIR", "VENDOR"]);
const PASSWORD_POLICY = { minimumLength: 8, requireUpper: true, requireLower: true, requireDigit: true };

const DEFAULT_TTL_SOURCE = process.env.JWT_ACCESS_TTL?.trim() || "15m";
const SESSION_TTL_SECONDS = resolveTtl(DEFAULT_TTL_SOURCE);
const COOKIE_NAME = process.env.JWT_COOKIE_NAME?.trim() || DEFAULT_COOKIE_NAME;
const COOKIE_DOMAIN = process.env.JWT_COOKIE_DOMAIN?.trim();
const COOKIE_SECURE = (process.env.NODE_ENV || "development") !== "development";
const JWT_SECRET = process.env.JWT_SECRET?.trim() || "changeme";

/**
 * Parses the TTL string (e.g. `15m`) into seconds with a fallback to 15 minutes.
 *
 * @param {string} source - Env provided TTL string.
 * @returns {number} TTL in seconds.
 */
function resolveTtl(source) {
  try {
    return jwtInternal.toSeconds(source, "invalid_session_ttl");
  } catch (error) {
    console.warn("Invalid JWT_ACCESS_TTL provided, falling back to 15m", error);
    return jwtInternal.toSeconds("15m", "invalid_session_ttl");
  }
}

/**
 * Normalizes an email address by trimming whitespace and lower-casing the value.
 *
 * @param {unknown} value - Raw email string from the request body.
 * @returns {string | null} Sanitized email value or null when invalid.
 */
function normaliseEmail(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.toLowerCase() : null;
}

/**
 * Checks whether the provided email resembles a valid address.
 *
 * @param {string | null} email - Sanitized email value.
 * @returns {boolean} True when the email looks valid.
 */
function isValidEmail(email) {
  if (!email) {
    return false;
  }
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

/**
 * Validates a password against the configured policy.
 *
 * @param {unknown} password - Raw password from the request body.
 * @returns {{ ok: boolean; reasons: string[]; value: string | null }} Validation result.
 */
function validatePassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    return { ok: false, reasons: ["missing"], value: null };
  }

  const reasons = [];
  if (password.length < PASSWORD_POLICY.minimumLength) {
    reasons.push("too_short");
  }
  if (PASSWORD_POLICY.requireUpper && !/[A-Z]/.test(password)) {
    reasons.push("missing_uppercase");
  }
  if (PASSWORD_POLICY.requireLower && !/[a-z]/.test(password)) {
    reasons.push("missing_lowercase");
  }
  if (PASSWORD_POLICY.requireDigit && !/[0-9]/.test(password)) {
    reasons.push("missing_digit");
  }

  return { ok: reasons.length === 0, reasons, value: password };
}

/**
 * Formats a Date into an ISO string when possible.
 *
 * @param {unknown} value - Potential date value.
 * @returns {string | null} ISO string or null.
 */
function maybeIso(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return null;
}

/**
 * Maps a user record to the JSON payload returned by the API.
 *
 * @param {{ id: string; email: string; role: string; locale?: string | null; phone?: string | null; createdAt?: Date; updatedAt?: Date }} user
 *   User entity returned by the repository.
 * @returns {Record<string, any>} Sanitized representation.
 */
function serialiseUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    locale: user.locale ?? "ru",
    phone: user.phone ?? null,
    createdAt: maybeIso(user.createdAt),
    updatedAt: maybeIso(user.updatedAt),
  };
}

/**
 * Issues a signed JWT and matching cookie header for the provided user.
 *
 * @param {ReturnType<typeof serialiseUser> & { id: string }} user - Sanitized user payload.
 * @param {string} secret - HMAC secret for JWT signing.
 * @param {number} ttlSeconds - Session duration in seconds.
 * @param {string} cookieName - Name of the HTTP-only cookie to set.
 * @param {boolean} secure - Whether the cookie should include the `Secure` attribute.
 * @param {string | undefined} domain - Optional domain attribute for the cookie.
 * @param {() => Date} now - Clock provider used for deterministic testing.
 * @returns {{ token: string; cookie: string }} Token string and formatted cookie header.
 */
function issueSession(user, secret, ttlSeconds, cookieName, secure, domain, now) {
  const issuedAt = now();
  const token = signJwt(
    { sub: user.id, role: user.role },
    secret,
    { expiresIn: ttlSeconds, now: issuedAt }
  );

  const cookieParts = [
    `${cookieName}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${ttlSeconds}`,
  ];
  if (secure) {
    cookieParts.push("Secure");
  }
  if (domain) {
    cookieParts.push(`Domain=${domain}`);
  }

  return { token, cookie: cookieParts.join("; ") };
}

/**
 * Creates a user repository backed by Prisma.
 *
 * @param {PrismaClient} client - Prisma client instance.
 * @returns {{ findByEmail(email: string): Promise<any | null>; createUser(data: any): Promise<any> }} CRUD helpers.
 */
export function createPrismaUserRepository(client) {
  return {
    async findByEmail(email) {
      return client.user.findUnique({ where: { email } });
    },
    async createUser(data) {
      return client.user.create({ data });
    },
  };
}

/**
 * Factory producing register/login handlers that remain easy to unit test.
 *
 * @param {{
 *   userRepository: { findByEmail(email: string): Promise<any | null>; createUser(data: any): Promise<any> };
 *   jwtSecret?: string;
 *   sessionTtlSeconds?: number;
 *   cookieName?: string;
 *   cookieDomain?: string | undefined;
 *   cookieSecure?: boolean;
 *   now?: () => Date;
 *   hash?: (password: string) => Promise<string>;
 *   verify?: (password: string, digest: string) => Promise<boolean>;
 * }} options - Handler dependencies.
 * @returns {{ register(body: any): Promise<{ status: number; body: any; cookies?: string[] }>; login(body: any): Promise<{ status: number; body: any; cookies?: string[] }> }}
 *   Ready-to-use handlers.
 */
export function createAuthHandlers(options) {
  const {
    userRepository,
    jwtSecret = JWT_SECRET,
    sessionTtlSeconds = SESSION_TTL_SECONDS,
    cookieName = COOKIE_NAME,
    cookieDomain = COOKIE_DOMAIN,
    cookieSecure = COOKIE_SECURE,
    now = () => new Date(),
    hash = hashPassword,
    verify = verifyPassword,
  } = options;

  if (!userRepository) {
    throw new Error("userRepository_required");
  }
  if (typeof sessionTtlSeconds !== "number" || !Number.isFinite(sessionTtlSeconds) || sessionTtlSeconds <= 0) {
    throw new Error("invalid_session_ttl");
  }

  async function register(body) {
    const email = normaliseEmail(body?.email);
    if (!isValidEmail(email)) {
      return { status: 400, body: { error: "invalid_email" } };
    }

    const passwordResult = validatePassword(body?.password);
    if (!passwordResult.ok || !passwordResult.value) {
      return { status: 400, body: { error: "weak_password", reasons: passwordResult.reasons } };
    }

    const requestedRole = typeof body?.role === "string" ? body.role.trim().toUpperCase() : "PAIR";
    if (!ALLOWED_ROLES.has(requestedRole)) {
      return { status: 400, body: { error: "invalid_role" } };
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return { status: 409, body: { error: "email_taken" } };
    }

    const passwordHash = await hash(passwordResult.value);
    const user = await userRepository.createUser({
      email,
      passwordHash,
      role: requestedRole,
      locale: typeof body?.locale === "string" && body.locale.trim().length > 0 ? body.locale.trim() : "ru",
      phone: typeof body?.phone === "string" && body.phone.trim().length > 0 ? body.phone.trim() : null,
    });

    const serialised = serialiseUser(user);
    const session = issueSession(serialised, jwtSecret, sessionTtlSeconds, cookieName, cookieSecure, cookieDomain, now);

    return {
      status: 201,
      body: { user: serialised, token: session.token },
      cookies: [session.cookie],
    };
  }

  async function login(body) {
    const email = normaliseEmail(body?.email);
    const password = typeof body?.password === "string" ? body.password : null;

    if (!isValidEmail(email) || !password) {
      return { status: 400, body: { error: "invalid_credentials" } };
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { status: 401, body: { error: "invalid_credentials" } };
    }

    const isValid = await verify(password, user.passwordHash);
    if (!isValid) {
      return { status: 401, body: { error: "invalid_credentials" } };
    }

    const serialised = serialiseUser(user);
    const session = issueSession(serialised, jwtSecret, sessionTtlSeconds, cookieName, cookieSecure, cookieDomain, now);

    return {
      status: 200,
      body: { user: serialised, token: session.token },
      cookies: [session.cookie],
    };
  }

  return { register, login };
}

/**
 * Reads the request body and parses JSON while enforcing a payload limit.
 *
 * @param {http.IncomingMessage} req - Incoming HTTP request.
 * @param {number} limit - Maximum body size in bytes.
 * @returns {Promise<any>} Parsed JSON payload.
 */
async function readJson(req, limit = 1024 * 64) {
  const chunks = [];
  let received = 0;

  for await (const chunk of req) {
    received += chunk.length;
    if (received > limit) {
      throw new HttpError(413, "payload_too_large");
    }
    chunks.push(chunk);
  }

  if (received === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "invalid_json");
  }
}

/**
 * Thin error class carrying the desired HTTP status code.
 */
class HttpError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

/**
 * Serialises JSON responses and attaches optional cookies.
 *
 * @param {http.ServerResponse} res - HTTP response object.
 * @param {number} status - HTTP status code.
 * @param {any} body - Response payload.
 * @param {string[] | undefined} cookies - Optional cookie headers to set.
 */
function sendJson(res, status, body, cookies) {
  if (cookies?.length) {
    res.setHeader("Set-Cookie", cookies);
  }
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

/**
 * Creates an HTTP server that exposes /health, /auth/register and /auth/login endpoints.
 *
 * @param {{ userRepository?: ReturnType<typeof createPrismaUserRepository>; handlers?: ReturnType<typeof createAuthHandlers> }} [overrides]
 *   Optional overrides primarily used in tests.
 * @returns {http.Server} Configured HTTP server instance.
 */
export function createAuthServer(overrides = {}) {
  const repository = overrides.userRepository ?? createPrismaUserRepository(prisma);
  const handlers = overrides.handlers ?? createAuthHandlers({ userRepository: repository });

  return http.createServer(async (req, res) => {
    applySecurityHeaders(res);
    
    try {
      if (req.method === "GET" && req.url === "/health") {
        return sendJson(res, 200, { status: "ok" });
      }

      if (req.method === "POST" && req.url === "/auth/register") {
        const body = await readJson(req);
        const result = await handlers.register(body);
        return sendJson(res, result.status, result.body, result.cookies);
      }

      if (req.method === "POST" && req.url === "/auth/login") {
        const body = await readJson(req);
        const result = await handlers.login(body);
        return sendJson(res, result.status, result.body, result.cookies);
      }

      sendJson(res, 404, { error: "not_found" });
    } catch (error) {
      if (error instanceof HttpError) {
        return sendJson(res, error.status, { error: error.code });
      }

      console.error("Unexpected auth service error", error);
      sendJson(res, 500, { error: "internal_error" });
    }
  });
}

export const __internal = {
  normaliseEmail,
  isValidEmail,
  validatePassword,
  serialiseUser,
  issueSession,
  readJson,
  HttpError,
  sendJson,
};

// health

