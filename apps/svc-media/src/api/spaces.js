import { randomBytes } from "node:crypto";
import { createServer } from "node:http";

import { presignPut } from "../../../packages/spaces/presign.js";

/**
 * TCP port that the presign API listens on. The service defaults to 3195 so it
 * does not collide with other local microservices.
 */
const port = process.env.PORT || 3195;

/**
 * Reads and parses the incoming JSON request body.
 *
 * @param {import("node:http").IncomingMessage} req - The incoming HTTP request.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 */
async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("invalid_json_body");
  }
}

/**
 * Generates a deterministic upload object key for the DigitalOcean Spaces
 * bucket. The key groups uploads under the `uploads/` prefix and ensures a
 * unique suffix using the current timestamp and a cryptographically random
 * identifier so collisions are practically impossible.
 *
 * @param {string | undefined} extension - Optional file extension provided by the client.
 * @returns {string} Object key relative to the bucket root.
 */
function generateObjectKey(extension) {
  const normalizedExt = typeof extension === "string" && extension.trim().length > 0
    ? extension.trim().replace(/^\./, "")
    : "jpg";

  const randomSuffix = randomBytes(6).toString("hex");
  return `uploads/${Date.now()}-${randomSuffix}.${normalizedExt}`;
}

/**
 * Sends a JSON response with the provided status code and body.
 *
 * @param {import("node:http").ServerResponse} res - HTTP response object.
 * @param {number} statusCode - HTTP status code to send.
 * @param {Record<string, unknown>} payload - JSON payload.
 */
function respondJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

/**
 * Creates an HTTP server that provides the `/spaces/presign` endpoint. The
 * endpoint accepts POST requests with an optional `contentType` and `ext`
 * (extension) and responds with the presigned PUT URL and headers for uploading
 * directly to DigitalOcean Spaces. The response also includes the public URL of
 * the object without the query string. When Spaces credentials are not
 * configured the handler responds with HTTP 500 so deployment misconfigurations
 * are surfaced immediately.
 */
createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/spaces/presign") {
    try {
      const body = await readJsonBody(req);
      const contentType = typeof body.contentType === "string" && body.contentType.trim().length > 0
        ? body.contentType
        : "image/jpeg";
      const key = generateObjectKey(typeof body.ext === "string" ? body.ext : undefined);

      const presigned = presignPut({ key, contentType });
      const publicUrl = presigned.url.split("?")[0];

      respondJson(res, 200, {
        uploadUrl: presigned.url,
        headers: presigned.headers,
        publicUrl,
        key,
      });
      return;
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown_error";
      const status = reason === "spaces_credentials_not_configured" ? 500 : 400;
      respondJson(res, status, { error: reason });
      return;
    }
  }

  res.writeHead(404);
  res.end();
}).listen(port, "0.0.0.0");

// health

