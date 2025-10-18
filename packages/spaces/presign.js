import crypto from "node:crypto";

/**
 * Computes an HMAC-SHA256 digest for the provided data using the given key.
 *
 * @param {string | Buffer} key - Secret key for the HMAC operation.
 * @param {string} data - Data to sign.
 * @returns {Buffer} Resulting digest.
 */
function hmac(key, data) {
  return crypto.createHmac("sha256", key).update(data).digest();
}

/**
 * Computes a hex-encoded HMAC-SHA256 digest.
 *
 * @param {crypto.BinaryLike | NodeJS.ArrayBufferView} key - Secret key for the HMAC operation.
 * @param {string} data - Data to sign.
 * @returns {string} Hex encoded digest string.
 */
function hexhmac(key, data) {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

/**
 * Encodes a string using RFC 3986 rules (S3 canonical form).
 *
 * @param {string} value - Value to encode.
 * @returns {string} RFC 3986 compliant encoding.
 */
function encodeRfc3986(value) {
  return encodeURIComponent(value).replace(/[!*'()]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

/**
 * Ensures each path segment is encoded while preserving slashes.
 *
 * @param {string} key - Raw object key.
 * @returns {string} Canonicalized key.
 */
function canonicaliseKey(key) {
  return key
    .split("/")
    .map((segment) => encodeRfc3986(segment))
    .join("/");
}

/**
 * Generates a presigned PUT URL compatible with DigitalOcean Spaces (S3).
 *
 * @param {{ key: string; contentType: string; payloadHash?: string }} params - Parameters for signing.
 * @returns {{ url: string; headers: Record<string, string> }} Signed URL and required headers.
 * @throws {Error} When the object key, content type, or Spaces credentials are misconfigured.
 */
export function presignPut({ key, contentType, payloadHash }) {
  const rawKey = typeof key === "string" ? key.trim() : "";
  if (!rawKey) {
    throw new Error("invalid_object_key");
  }

  const resolvedContentType = typeof contentType === "string" && contentType.trim().length > 0
    ? contentType.trim()
    : "";
  if (!resolvedContentType) {
    throw new Error("invalid_content_type");
  }

  const access = process.env.SPACES_KEY && process.env.SPACES_KEY.trim();
  const secret = process.env.SPACES_SECRET && process.env.SPACES_SECRET.trim();
  const bucket = process.env.SPACES_BUCKET && process.env.SPACES_BUCKET.trim();
  const region = process.env.SPACES_REGION && process.env.SPACES_REGION.trim() ? process.env.SPACES_REGION.trim() : "ams3";

  if (!access || !secret || !bucket) {
    throw new Error("spaces_credentials_not_configured");
  }
  const host = `${bucket}.${region}.digitaloceanspaces.com`;
  const service = "s3";
  const algorithm = "AWS4-HMAC-SHA256";
  const amzdate = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z/, "Z");
  const datestamp = amzdate.slice(0, 8);
  const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
  const hashedPayload = typeof payloadHash === "string" && payloadHash.trim().length > 0
    ? payloadHash.trim()
    : "UNSIGNED-PAYLOAD";
  const canonicalKey = canonicaliseKey(rawKey.replace(/^\/+/, ""));
  const headerEntries = [
    ["host", host],
    ["content-type", resolvedContentType],
    ["x-amz-content-sha256", hashedPayload],
    ["x-amz-date", amzdate],
  ];

  headerEntries.sort(([a], [b]) => a.localeCompare(b));

  const canonicalHeaders = `${headerEntries
    .map(([name, value]) => `${name}:${value}`)
    .join("\n")}\n`;
  const signedHeaders = headerEntries.map(([name]) => name).join(";");

  const queryEntries = [
    ["X-Amz-Algorithm", algorithm],
    ["X-Amz-Credential", `${access}/${credentialScope}`],
    ["X-Amz-Date", amzdate],
    ["X-Amz-Expires", "300"],
    ["X-Amz-SignedHeaders", signedHeaders],
  ];

  queryEntries.sort(([a], [b]) => a.localeCompare(b));

  const canonicalQueryString = queryEntries
    .map(([name, value]) => `${encodeRfc3986(name)}=${encodeRfc3986(value)}`)
    .join("&");

  const canonicalRequest = `PUT\n/${canonicalKey}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;
  const stringToSign = `${algorithm}\n${amzdate}\n${credentialScope}\n${crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex")}`;

  const kDate = hmac(`AWS4${secret}`, datestamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = hexhmac(kSigning, stringToSign);

  const queryString = `${canonicalQueryString}&X-Amz-Signature=${signature}`;
  const url = `https://${host}/${canonicalKey}?${queryString}`;

  return {
    url,
    headers: {
      "x-amz-date": amzdate,
      "Content-Type": resolvedContentType,
      "x-amz-content-sha256": hashedPayload,
    },
  };
}
