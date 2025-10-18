import http from "node:http";
import https from "node:https";
import { PrismaClient } from "@prisma/client";

import { sign } from "../../../packages/webhooks/sign.js";

const prisma = new PrismaClient();

/**
 * Notifies all active partner endpoints that a catalog entity has changed.
 *
 * @param {string} vendorId - Identifier of the vendor whose profile changed.
 * @returns {Promise<void>} Resolves once webhook requests have been attempted.
 */
export async function notifyCatalogUpdated(vendorId) {
  if (!vendorId) {
    return;
  }

  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { active: true },
  });

  if (endpoints.length === 0) {
    return;
  }

  const body = JSON.stringify({ topic: "catalog.updated", vendorId, ts: Date.now() });
  const tasks = endpoints.map(async (endpoint) => {
    try {
      const target = new URL(endpoint.url);
      const client = target.protocol === "https:" ? https : http;
      const signature = sign(body, endpoint.secret);

      await new Promise((resolve) => {
        const req = client.request(
          {
            hostname: target.hostname,
            port: target.port || (target.protocol === "https:" ? 443 : 80),
            method: "POST",
            path: `${target.pathname}${target.search}` || "/",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(body),
              "X-Signature": signature,
            },
          },
          (res) => {
            res.resume();
            res.on("end", resolve);
          }
        );

        req.on("error", (error) => {
          console.error("catalog_webhook_failed", {
            endpoint: endpoint.url,
            error: error.message,
          });
          resolve();
        });

        req.write(body);
        req.end();
      });
    } catch (error) {
      console.error("catalog_webhook_error", {
        endpoint: endpoint.url,
        error: error.message,
      });
    }
  });

  await Promise.all(tasks);
}
