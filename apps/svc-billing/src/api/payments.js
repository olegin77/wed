import { createServer } from "node:http";

/**
 * Serializes a JavaScript value and sends it as a JSON response.
 *
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {number} status - HTTP status code to send to the client.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 */
function respondJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

/**
 * Reads the entire request body and tries to decode it as JSON.
 *
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 */
async function readJson(req) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    chunks.push(chunk);
    totalBytes += chunk.length;
    if (totalBytes > 1_048_576) {
      throw new Error("payload_too_large");
    }
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    const parseError = new Error("invalid_json");
    parseError.cause = error;
    throw parseError;
  }
}

const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);

createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/pay/create-intent") {
      const payload = await readJson(req);
      const amount = Number(payload.amount ?? 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
      }

      return respondJson(res, 200, {
        ok: true,
        id: "pi_demo_1",
        clientSecret: "secret_demo",
      });
    }

    if (req.method === "POST" && req.url === "/pay/capture") {
      await readJson(req);
      return respondJson(res, 200, { ok: true, status: "succeeded" });
    }

    if (req.method === "POST" && req.url === "/pay/webhook") {
      await readJson(req);
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("ok");
    }

    res.writeHead(404);
    res.end();
  } catch (error) {
    console.error("payments_stub_error", error);
    if (error.message === "payload_too_large") {
      res.writeHead(413);
      res.end();
      return;
    }
    if (error.message === "invalid_json") {
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      return;
    }
    respondJson(res, 500, { ok: false, reason: "internal_error" });
  }
}).listen(port, "0.0.0.0", () => {
  console.log("payments stub listening", port);
});
