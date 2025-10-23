import { createServer } from "http";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { updateIndex } from "../indexer/booking-index.js";

const prisma = new PrismaClient();
const port = process.env.BOOKING_PORT || 3011;

const json = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("payload_too_large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });

const cookieUserId = (req) => {
  const cookie = (req.headers.cookie || "")
    .split(";")
    .find((part) => part.trim().startsWith("jwt="));
  if (!cookie) return null;
  try {
    const [, payload] = cookie.split(".");
    const decoded = Buffer.from(payload, "base64").toString();
    const parsed = JSON.parse(decoded);
    return parsed?.sub || null;
  } catch {
    return null;
  }
};

createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/booking/create") {
    // REQUIRE: verified phone (stub: allow)
      const userId = cookieUserId(req);
      if (!userId) {
        return json(res, 401, { ok: false, reason: "unauthorized" });
      }

      const payload = await readBody(req);
      const { lockId } = payload;
      if (!lockId) {
        return json(res, 400, { ok: false, reason: "invalid_params" });
      }

      const lock = await prisma.slotLock.findUnique({ where: { id: lockId } });
      if (!lock) {
        return json(res, 404, { ok: false, reason: "lock_not_found" });
      }

      if (lock.lockedUntil < new Date()) {
        return json(res, 409, { ok: false, reason: "lock_expired" });
      }

      const booking = await prisma.booking.create({
    // hook: резервировать ресурс по умолчанию (stub)
        data: {
          userId,
          vendorId: lock.vendorId,
          startAt: lock.startAt,
          endAt: lock.endAt,
          status: "PENDING_PAYMENT",
        },
      });

      try {
        await updateIndex(booking.vendorId, lock.startAt, lock.endAt);
      } catch (error) {
        console.warn("booking_index_update_failed", error);
      }

      return json(res, 201, { ok: true, id: booking.id });
    }

    res.writeHead(404);
    res.end();
  } catch (error) {
    console.error("booking_api_error", error);
    json(res, 500, { ok: false, reason: "internal_error" });
  }
}).listen(port, "0.0.0.0", () => {
  console.log("booking api listening", port);
});

// health

