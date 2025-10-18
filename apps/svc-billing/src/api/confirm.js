import { createServer } from "node:http";

import { markPaid } from "../hooks/booking-paid.js";
import { notify } from "../webhooks/dispatch.js";

/**
 * Reads a JSON body from an HTTP request.
 *
 * @param {import("node:http").IncomingMessage} req - Incoming request instance.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload.
 */
async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
    if (chunks.length > 2048) {
      throw new Error("payload_too_large");
    }
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    const parseError = new Error("invalid_json");
    parseError.cause = error;
    throw parseError;
  }
}

/**
 * Writes a JSON response with the provided payload.
 *
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {number} status - HTTP status code.
 * @param {unknown} payload - Response payload that will be stringified.
 */
function respondJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

const port = Number(process.env.BILLING_CONFIRM_PORT || process.env.PORT || 3012);

createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/booking/confirm") {
      const payload = await readJson(req);
      const bookingId = String(payload.bookingId || "").trim();
      if (!bookingId) {
        return respondJson(res, 400, { ok: false, reason: "missing_booking_id" });
      }

      const result = await markPaid(bookingId);
      if (!result.ok) {
        const status = result.reason === "booking_not_found" ? 404 : 500;
        return respondJson(res, status, result);
      }

      try {
        await notify("booking.paid", { bookingId: result.bookingId });
      } catch (error) {
        console.error("booking_confirm_webhook_error", error);
      }

      return respondJson(res, 200, { ok: true, bookingId: result.bookingId });
    }

    res.writeHead(404);
    res.end();
  } catch (error) {
    console.error("booking_confirm_error", error);
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
  console.log("booking confirm api listening", port);
});
