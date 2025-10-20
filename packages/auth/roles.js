import { verifyJwt } from "./jwt.js";

const ROLE_HIERARCHY = new Map([
  ["USER", 1],
  ["VENDOR", 2],
  ["ADMIN", 3],
]);

/**
 * Extracts the JWT token from the Cookie header.
 *
 * @param {string | undefined} cookieHeader - Raw Cookie header value.
 * @returns {string | null} Serialized JWT token when present, otherwise null.
 */
export function extractJwtFromCookie(cookieHeader) {
  if (!cookieHeader || typeof cookieHeader !== "string") {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("jwt="));

  if (!cookie) {
    return null;
  }

  const [, token] = cookie.split("=");
  return token && token.length > 0 ? token : null;
}

/**
 * Resolves the JWT secret used for signature verification.
 *
 * @returns {string | null} Shared secret or null when not configured.
 */
export function resolveJwtSecret() {
  const secret = process.env.JWT_SECRET || "";
  return secret.length > 0 ? secret : null;
}

/**
 * Produces an Express/Connect compatible middleware that validates the
 * requester role using the JWT stored in the `jwt` cookie. The middleware
 * rejects unauthenticated callers with `401` and callers lacking privileges
 * with `403`. When the token is valid, the decoded claims are exposed via
 * `req.user` for downstream handlers.
 *
 * @param {"ADMIN" | "VENDOR" | "USER"} requiredRole - Minimal role level.
 * @returns {(req: any, res: any, next: Function) => void} Middleware function.
 */
export function requireRole(requiredRole) {
  if (!ROLE_HIERARCHY.has(requiredRole)) {
    throw new Error("unsupported_role");
  }

  return (req, res, next) => {
    const token = extractJwtFromCookie(req.headers?.cookie);
    if (!token) {
      res.writeHead(401);
      res.end("unauthenticated");
      return;
    }

    const secret = resolveJwtSecret();
    if (!secret) {
      res.writeHead(500);
      res.end("jwt_secret_missing");
      return;
    }

    const claims = verifyJwt(token, secret, { clockTolerance: "2s" });
    if (!claims) {
      res.writeHead(401);
      res.end("invalid_token");
      return;
    }

    const userRole = typeof claims.role === "string" ? claims.role : null;
    if (!userRole || !ROLE_HIERARCHY.has(userRole)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }

    const userLevel = ROLE_HIERARCHY.get(userRole) ?? 0;
    const requiredLevel = ROLE_HIERARCHY.get(requiredRole) ?? Number.POSITIVE_INFINITY;

    if (userLevel < requiredLevel) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }

    req.user = claims;
    next();
  };
}

export const __testing = { ROLE_HIERARCHY };
