import http from "http";
import { PrismaClient } from "@prisma/client";

import { handleCatalogSearch } from "./api/search.js";

const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

const json = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const startOfDayUtc = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

http
  .createServer(async (req, res) => {
    try {
      if (req.url === "/health") {
        let db = false;
        try {
          await prisma.$queryRaw`SELECT 1`;
          db = true;
        } catch (error) {
          console.warn("catalog_health_db_check_failed", error);
        }
        return json(res, 200, { status: "ok", db });
      }

      if (req.method === "GET" && req.url?.startsWith("/catalog/available")) {
        const url = new URL(req.url, "http://localhost");
        const rawDate = url.searchParams.get("date");
        const today = startOfDayUtc(new Date());
        const target = rawDate ? new Date(`${rawDate}T00:00:00.000Z`) : today;

        if (Number.isNaN(target.getTime())) {
          return json(res, 400, { ok: false, reason: "invalid_date" });
        }

        const busy = await prisma.bookingIndex.findMany({
          where: { day: target },
          select: { vendorId: true },
        });
        const busyVendorIds = busy.map((entry) => entry.vendorId);

        const where = busyVendorIds.length
          ? { id: { notIn: busyVendorIds } }
          : undefined;

        const availableVendors = await prisma.vendor.findMany({
          where,
        });

        return json(res, 200, {
          ok: true,
          date: target.toISOString().slice(0, 10),
          vendors: availableVendors,
        });
      }

      if (req.method === "GET" && req.url?.startsWith("/catalog/search")) {
        await handleCatalogSearch(req, res, { prisma, json });
        return;
      }

      res.writeHead(404);
      res.end();
    } catch (error) {
      console.error("catalog_service_error", error);
      json(res, 500, { ok: false, reason: "internal_error" });
    }
  })
  .listen(port, "0.0.0.0", () => console.log("svc ok", port));
