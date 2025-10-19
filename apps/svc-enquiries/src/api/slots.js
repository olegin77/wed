import { createServer } from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const port = process.env.SLOTS_PORT || 3010;

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
    if (req.method === "GET" && req.url?.startsWith("/slots/free")) {
      const url = new URL(req.url, "http://localhost");
      const vendorId = url.searchParams.get("vendorId");
      const date = url.searchParams.get("date");

      if (!vendorId || !date) {
        return json(res, 400, { ok: false, reason: "invalid_params" });
      }

      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      if (Number.isNaN(startOfDay.getTime())) {
        return json(res, 400, { ok: false, reason: "invalid_date" });
      }

      const [locks, bookings] = await Promise.all([
        prisma.slotLock.findMany({
          where: {
            vendorId,
            lockedUntil: { gt: new Date() },
          },
        }),
        prisma.booking.findMany({
          where: {
            vendorId,
            startAt: { gte: startOfDay },
            endAt: { lte: endOfDay },
          },
        }),
      ]);

      return json(res, 200, { ok: true, locks, bookings });
    }

    if (req.method === "POST" && req.url === "/slots/lock") {
      const userId = cookieUserId(req);
      if (!userId) {
        return json(res, 401, { ok: false, reason: "unauthorized" });
      }

      const payload = await readBody(req);
      const { vendorId, startAt, endAt } = payload;

      if (!vendorId || !startAt || !endAt) {
        return json(res, 400, { ok: false, reason: "invalid_params" });
      }

      const start = new Date(startAt);
      const end = new Date(endAt);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return json(res, 400, { ok: false, reason: "invalid_date" });
      }

      const lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
      const lock = await prisma.slotLock.create({
        data: {
          vendorId,
          startAt: start,
          endAt: end,
          lockedUntil,
          byUserId: userId,
        },
      });

      return json(res, 200, {
        ok: true,
        id: lock.id,
        lockedUntil,
      });
    }

    res.writeHead(404);
    res.end();
  } catch (error) {
    console.error("slots_api_error", error);
    json(res, 500, { ok: false, reason: "internal_error" });
  }
}).listen(port, "0.0.0.0", () => {
  console.log("slots api listening", port);
});
