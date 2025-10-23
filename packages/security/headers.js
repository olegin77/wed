/**
 * @typedef {[string, string]} SecurityHeader
 */

/** @type {readonly SecurityHeader[]} */
export const securityHeaders = Object.freeze([
  ["X-Frame-Options", "DENY"],
  ["X-Content-Type-Options", "nosniff"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Cross-Origin-Resource-Policy", "same-origin"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=()"],
  ["X-DNS-Prefetch-Control", "off"],
  ["X-XSS-Protection", "1; mode=block"],
  ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
  ["Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"],
]);

/**
 * Apply the default security headers to a Node.js HTTP response.
 * Existing header values are preserved to allow route-specific overrides.
 *
 * @param {import("http").ServerResponse} res
 * @param {readonly SecurityHeader[]} [overrides]
 * @returns {import("http").ServerResponse}
 */
export function applySecurityHeaders(res, overrides = []) {
  for (const [key, value] of [...securityHeaders, ...overrides]) {
    if (!key || typeof value === "undefined") {
      continue;
    }

    if (res.getHeader(key) === undefined) {
      res.setHeader(key, value);
    }
  }

  return res;
}
