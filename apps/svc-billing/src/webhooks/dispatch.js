import http from "node:http";
import https from "node:https";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { sign } from "../../../packages/webhooks/sign.js";

const prisma = new PrismaClient();

/**
 * Dispatches a webhook notification to all active partner endpoints.
 *
 * @param {string} topic - Event topic name (e.g. `booking.paid`).
 * @param {Record<string, unknown>} payload - Event payload delivered to partners.
 * @returns {Promise<void>} Resolves when dispatch attempts have been scheduled.
 */
export async function notify(topic, payload) {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { active: true },
  });

  if (endpoints.length === 0) {
    return;
  }

  const body = JSON.stringify({ topic, payload, ts: Date.now() });
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
          console.error("webhook_dispatch_failed", {
            endpoint: endpoint.url,
            error: error.message,
          });
          resolve();
        });

        req.write(body);
        req.end();
      });
    } catch (error) {
      console.error("webhook_dispatch_error", {
        endpoint: endpoint.url,
        error: error.message,
      });
    }
  });

  await Promise.all(tasks);
}
