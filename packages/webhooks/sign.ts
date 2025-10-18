import crypto from "node:crypto";

/**
 * Generates a deterministic HMAC-SHA256 signature for the provided payload.
 *
 * @param {string} body - JSON payload that will be sent to the webhook consumer.
 * @param {string} secret - Shared secret associated with the webhook endpoint.
 * @returns {string} Hex encoded signature string.
 */
export function sign(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

/**
 * Verifies that an incoming signature matches the expected HMAC-SHA256 digest.
 *
 * @param {string} body - Raw request body.
 * @param {string} signature - Signature provided by the sender.
 * @param {string} secret - Shared secret used to re-compute the digest.
 * @returns {boolean} True when the signature matches the computed digest.
 */
export function verify(body: string, signature: string, secret: string): boolean {
  const expected = sign(body, secret);
  const provided = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (provided.length !== expectedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(provided, expectedBuffer);
}
