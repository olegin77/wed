import crypto from "node:crypto";

const DURATION_UNITS = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
};

/**
 * Encodes a buffer into base64url without padding according to RFC 7515.
 *
 * @param {Buffer | string} value - Raw bytes to encode.
 * @returns {string} Base64url encoded representation.
 */
function base64UrlEncode(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Decodes a base64url string back into a buffer.
 *
 * @param {string} value - Base64url encoded input.
 * @returns {Buffer} Decoded bytes.
 */
function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, "base64");
}

/**
 * Parses a duration expressed either as seconds or in a "10m" style shorthand.
 *
 * @param {number | string | undefined} value - Declared duration.
 * @param {string} errorCode - Error code for invalid values.
 * @returns {number | undefined} Duration in seconds, if provided.
 */
function toSeconds(value, errorCode) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(errorCode);
    }

    return Math.floor(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const match = value.trim().match(/^(\d+)([smhd])?$/);
    if (!match) {
      throw new Error(errorCode);
    }

    const amount = Number.parseInt(match[1], 10);
    const unit = match[2] ?? "s";
    return amount * DURATION_UNITS[unit];
  }

  throw new Error(errorCode);
}

/**
 * Resolves the UNIX timestamp in seconds for the provided date-like input.
 *
 * @param {number | Date | undefined} value - Date override.
 * @returns {number} Timestamp in seconds.
 */
function toTimestamp(value) {
  if (value === undefined) {
    return Math.floor(Date.now() / 1000);
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("invalid_timestamp");
    }

    return Math.floor(value);
  }

  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1000);
  }

  throw new Error("invalid_timestamp");
}

/**
 * Signs a payload with an HS256 JSON Web Token.
 *
 * @param {Record<string, any>} payload - Claims that should be embedded in the token.
 * @param {string} secret - Shared secret used for HMAC signing.
 * @param {{ expiresIn?: number | string; notBefore?: number | string; now?: number | Date; includeIssuedAt?: boolean; }} [options]
 *   Optional signing options.
 * @returns {string} The encoded and signed JWT string.
 */
export function signJwt(payload, secret, options = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("invalid_payload");
  }

  if (typeof secret !== "string" || secret.length === 0) {
    throw new Error("invalid_secret");
  }

  const now = toTimestamp(options.now);
  const expiresIn = toSeconds(options.expiresIn, "invalid_expires_in");
  const notBefore = toSeconds(options.notBefore, "invalid_not_before");

  const header = { alg: "HS256", typ: "JWT" };
  const claims = { ...payload };

  if (options.includeIssuedAt !== false) {
    claims.iat = now;
  }

  if (typeof expiresIn === "number") {
    claims.exp = now + expiresIn;
  }

  if (typeof notBefore === "number") {
    claims.nbf = now + notBefore;
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", secret).update(data).digest();

  return `${data}.${base64UrlEncode(signature)}`;
}

/**
 * Verifies an HS256 JWT and returns its claims when valid.
 *
 * @param {string} token - Serialized JWT string.
 * @param {string} secret - Shared secret used for HMAC verification.
 * @param {{ now?: number | Date; clockTolerance?: number | string; }} [options] - Verification options.
 * @returns {Record<string, any> | null} Parsed claims when the token is valid, otherwise null.
 */
export function verifyJwt(token, secret, options = {}) {
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("invalid_token");
  }

  if (typeof secret !== "string" || secret.length === 0) {
    throw new Error("invalid_secret");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  let header;
  let payload;
  try {
    header = JSON.parse(base64UrlDecode(encodedHeader).toString("utf8"));
    payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8"));
  } catch {
    return null;
  }

  if (!header || header.alg !== "HS256" || header.typ !== "JWT") {
    return null;
  }

  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest();
  const providedSignature = base64UrlDecode(encodedSignature);

  if (providedSignature.length !== expectedSignature.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(providedSignature, expectedSignature)) {
    return null;
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const now = toTimestamp(options.now);
  const tolerance = toSeconds(options.clockTolerance, "invalid_clock_tolerance") ?? 0;

  if (payload.exp !== undefined) {
    const exp = Number(payload.exp);
    if (!Number.isFinite(exp) || now > Math.floor(exp) + tolerance) {
      return null;
    }
  }

  if (payload.nbf !== undefined) {
    const nbf = Number(payload.nbf);
    if (!Number.isFinite(nbf) || now + tolerance < Math.floor(nbf)) {
      return null;
    }
  }

  return Object.freeze({ ...payload });
}

/**
 * Decodes a JWT without verifying the signature. Intended for debug tooling.
 *
 * @param {string} token - Serialized JWT string.
 * @returns {{ header: Record<string, any>; payload: Record<string, any> } | null} The decoded components or null.
 */
export function decodeJwt(token) {
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("invalid_token");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    return {
      header: JSON.parse(base64UrlDecode(parts[0]).toString("utf8")),
      payload: JSON.parse(base64UrlDecode(parts[1]).toString("utf8")),
    };
  } catch {
    return null;
  }
}

export const __internal = {
  base64UrlEncode,
  base64UrlDecode,
  toSeconds,
  toTimestamp,
};
