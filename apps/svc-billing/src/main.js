import { createServer } from "node:http";
import { DemoProvider } from "../../../packages/pay/demo.js";

const port = Number(process.env.PORT || 3004);
const host = "0.0.0.0";

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

const server = createServer(async (req, res) => {
  try {
    // Health check endpoint
    if (req.method === "GET" && req.url === "/healthz") {
      return respondJson(res, 200, { status: "ok", service: "billing" });
    }

    // Create payment intent
    if (req.method === "POST" && req.url === "/pay/create-intent") {
      const payload = await readJson(req);
      const amount = Number(payload.amount ?? 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
      }

      // Apply promo code if provided
      let finalAmount = amount;
      if (payload.promo) {
        try {
          const { PrismaClient } = await import("@prisma/client");
          const { applyPromo } = await import("../../../packages/promo/apply.js");
          const db = new PrismaClient();
          const promo = await db.promo.findUnique({ where: { code: payload.promo } });
          if (promo && promo.active && (!promo.expiresAt || new Date(promo.expiresAt) > new Date())) {
            finalAmount = applyPromo(amount, promo.type, promo.value);
          }
          await db.$disconnect();
        } catch (e) {
          console.warn("Promo application failed:", e);
        }
      }

      const intent = await DemoProvider.createIntent({
        amount: finalAmount,
        currency: payload.currency || "UZS"
      });

      // Log revenue event
      try {
        const { PrismaClient } = await import("@prisma/client");
        const db = new PrismaClient();
        await db.revenueEvent.create({
          data: {
            type: "booking_fee",
            amountUZS: intent.amount,
            refId: intent.id
          }
        });
        await db.$disconnect();
      } catch (e) {
        console.warn("Revenue event logging failed:", e);
      }

      // Handle agency commission
      try {
        const { PrismaClient } = await import("@prisma/client");
        const db = new PrismaClient();
        const agencyMember = await db.agencyMember.findFirst({ where: { userId: "agent-demo" } });
        if (agencyMember) {
          const rule = await db.commissionRule.findFirst({});
          const commission = Math.floor((intent.amount || 0) * (rule?.percent || 0) / 100);
          await db.agencyCommission.create({
            data: {
              agencyId: agencyMember.agencyId,
              bookingId: intent.id,
              amountUZS: commission
            }
          });
        }
        await db.$disconnect();
      } catch (e) {
        console.warn("Agency commission failed:", e);
      }

      return respondJson(res, 200, intent);
    }

    // Capture payment
    if (req.method === "POST" && req.url === "/pay/capture") {
      const payload = await readJson(req);
      const result = await DemoProvider.capture(payload.id);
      return respondJson(res, 200, result);
    }

    // Refund payment
    if (req.method === "POST" && req.url === "/pay/refund") {
      const payload = await readJson(req);
      const result = await DemoProvider.refund(payload.id);
      return respondJson(res, 200, result);
    }

    // Webhook endpoint
    if (req.method === "POST" && req.url === "/pay/webhook") {
      await readJson(req);
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("ok");
    }

    // Not found
    res.writeHead(404);
    res.end();
  } catch (error) {
    console.error("billing_service_error", error);
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
});

server.listen(port, host, () => {
  console.log(`svc-billing listening on ${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
