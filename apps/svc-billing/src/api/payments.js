import { DemoProvider } from "../../../packages/pay/demo.js"; const P=DemoProvider;
import { DemoProvider } from "../../../packages/pay/demo.js"; const P=DemoProvider;
import { DemoProvider } from "../../../packages/pay/demo.js"; const P=DemoProvider;
import { DemoProvider } from "../../../packages/pay/demo.js"; const P=DemoProvider;
import { DemoProvider } from "../../../packages/pay/demo.js"; const P=DemoProvider;
import { DemoProvider } from "../../../packages/pay/demo.js"; const P=DemoProvider;
import { DemoProvider } from "../../../packages/pay/demo.js"; const P=DemoProvider;
import { DemoProvider } from "../../../packages/pay/demo.js"; const P=DemoProvider;
import { createServer } from "node:http";
import { createServer } from "node:http";
import { createServer } from "node:http";
import { createServer } from "node:http";
import { createServer } from "node:http";
import { createServer } from "node:http";
import { createServer } from "node:http";
import { createServer } from "node:http";








/**
/**
/**
/**
/**
/**
/**
/**
 * Serializes a JavaScript value and sends it as a JSON response.
 * Serializes a JavaScript value and sends it as a JSON response.
 * Serializes a JavaScript value and sends it as a JSON response.
 * Serializes a JavaScript value and sends it as a JSON response.
 * Serializes a JavaScript value and sends it as a JSON response.
 * Serializes a JavaScript value and sends it as a JSON response.
 * Serializes a JavaScript value and sends it as a JSON response.
 * Serializes a JavaScript value and sends it as a JSON response.
 *
 *
 *
 *
 *
 *
 *
 *
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {import("node:http").ServerResponse} res - HTTP response instance.
 * @param {number} status - HTTP status code to send to the client.
 * @param {number} status - HTTP status code to send to the client.
 * @param {number} status - HTTP status code to send to the client.
 * @param {number} status - HTTP status code to send to the client.
 * @param {number} status - HTTP status code to send to the client.
 * @param {number} status - HTTP status code to send to the client.
 * @param {number} status - HTTP status code to send to the client.
 * @param {number} status - HTTP status code to send to the client.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 * @param {unknown} payload - Response payload that will be JSON-stringified.
 */
 */
 */
 */
 */
 */
 */
 */
function respondJson(res, status, payload) {
function respondJson(res, status, payload) {
function respondJson(res, status, payload) {
function respondJson(res, status, payload) {
function respondJson(res, status, payload) {
function respondJson(res, status, payload) {
function respondJson(res, status, payload) {
function respondJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.writeHead(status, { "Content-Type": "application/json" });
  res.writeHead(status, { "Content-Type": "application/json" });
  res.writeHead(status, { "Content-Type": "application/json" });
  res.writeHead(status, { "Content-Type": "application/json" });
  res.writeHead(status, { "Content-Type": "application/json" });
  res.writeHead(status, { "Content-Type": "application/json" });
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
  res.end(JSON.stringify(payload));
  res.end(JSON.stringify(payload));
  res.end(JSON.stringify(payload));
  res.end(JSON.stringify(payload));
  res.end(JSON.stringify(payload));
  res.end(JSON.stringify(payload));
  res.end(JSON.stringify(payload));
}
}
}
}
}
}
}
}








/**
/**
/**
/**
/**
/**
/**
/**
 * Reads the entire request body and tries to decode it as JSON.
 * Reads the entire request body and tries to decode it as JSON.
 * Reads the entire request body and tries to decode it as JSON.
 * Reads the entire request body and tries to decode it as JSON.
 * Reads the entire request body and tries to decode it as JSON.
 * Reads the entire request body and tries to decode it as JSON.
 * Reads the entire request body and tries to decode it as JSON.
 * Reads the entire request body and tries to decode it as JSON.
 *
 *
 *
 *
 *
 *
 *
 *
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @param {import("node:http").IncomingMessage} req - Current HTTP request.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 * @returns {Promise<Record<string, unknown>>} Parsed JSON payload or an empty object.
 */
 */
 */
 */
 */
 */
 */
 */
async function readJson(req) {
async function readJson(req) {
async function readJson(req) {
async function readJson(req) {
async function readJson(req) {
async function readJson(req) {
async function readJson(req) {
async function readJson(req) {
  const chunks = [];
  const chunks = [];
  const chunks = [];
  const chunks = [];
  const chunks = [];
  const chunks = [];
  const chunks = [];
  const chunks = [];
  let totalBytes = 0;
  let totalBytes = 0;
  let totalBytes = 0;
  let totalBytes = 0;
  let totalBytes = 0;
  let totalBytes = 0;
  let totalBytes = 0;
  let totalBytes = 0;
  for await (const chunk of req) {
  for await (const chunk of req) {
  for await (const chunk of req) {
  for await (const chunk of req) {
  for await (const chunk of req) {
  for await (const chunk of req) {
  for await (const chunk of req) {
  for await (const chunk of req) {
    chunks.push(chunk);
    chunks.push(chunk);
    chunks.push(chunk);
    chunks.push(chunk);
    chunks.push(chunk);
    chunks.push(chunk);
    chunks.push(chunk);
    chunks.push(chunk);
    totalBytes += chunk.length;
    totalBytes += chunk.length;
    totalBytes += chunk.length;
    totalBytes += chunk.length;
    totalBytes += chunk.length;
    totalBytes += chunk.length;
    totalBytes += chunk.length;
    totalBytes += chunk.length;
    if (totalBytes > 1_048_576) {
    if (totalBytes > 1_048_576) {
    if (totalBytes > 1_048_576) {
    if (totalBytes > 1_048_576) {
    if (totalBytes > 1_048_576) {
    if (totalBytes > 1_048_576) {
    if (totalBytes > 1_048_576) {
    if (totalBytes > 1_048_576) {
      throw new Error("payload_too_large");
      throw new Error("payload_too_large");
      throw new Error("payload_too_large");
      throw new Error("payload_too_large");
      throw new Error("payload_too_large");
      throw new Error("payload_too_large");
      throw new Error("payload_too_large");
      throw new Error("payload_too_large");
    }
    }
    }
    }
    }
    }
    }
    }
  }
  }
  }
  }
  }
  }
  }
  }








  if (chunks.length === 0) {
  if (chunks.length === 0) {
  if (chunks.length === 0) {
  if (chunks.length === 0) {
  if (chunks.length === 0) {
  if (chunks.length === 0) {
  if (chunks.length === 0) {
  if (chunks.length === 0) {
    return {};
    return {};
    return {};
    return {};
    return {};
    return {};
    return {};
    return {};
  }
  }
  }
  }
  }
  }
  }
  }








  const raw = Buffer.concat(chunks).toString("utf8");
  const raw = Buffer.concat(chunks).toString("utf8");
  const raw = Buffer.concat(chunks).toString("utf8");
  const raw = Buffer.concat(chunks).toString("utf8");
  const raw = Buffer.concat(chunks).toString("utf8");
  const raw = Buffer.concat(chunks).toString("utf8");
  const raw = Buffer.concat(chunks).toString("utf8");
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  if (!raw) return {};
  if (!raw) return {};
  if (!raw) return {};
  if (!raw) return {};
  if (!raw) return {};
  if (!raw) return {};
  if (!raw) return {};








  try {
  try {
  try {
  try {
  try {
  try {
  try {
  try {
    return JSON.parse(raw);
    return JSON.parse(raw);
    return JSON.parse(raw);
    return JSON.parse(raw);
    return JSON.parse(raw);
    return JSON.parse(raw);
    return JSON.parse(raw);
    return JSON.parse(raw);
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
    const parseError = new Error("invalid_json");
    const parseError = new Error("invalid_json");
    const parseError = new Error("invalid_json");
    const parseError = new Error("invalid_json");
    const parseError = new Error("invalid_json");
    const parseError = new Error("invalid_json");
    const parseError = new Error("invalid_json");
    const parseError = new Error("invalid_json");
    parseError.cause = error;
    parseError.cause = error;
    parseError.cause = error;
    parseError.cause = error;
    parseError.cause = error;
    parseError.cause = error;
    parseError.cause = error;
    parseError.cause = error;
    throw parseError;
    throw parseError;
    throw parseError;
    throw parseError;
    throw parseError;
    throw parseError;
    throw parseError;
    throw parseError;
  }
  }
  }
  }
  }
  }
  }
  }
}
}
}
}
}
}
}
}








const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);
const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);
const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);
const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);
const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);
const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);
const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);
const port = Number(process.env.BILLING_PORT || process.env.PORT || 3004);








createServer(async (req, res) => {
createServer(async (req, res) => {
createServer(async (req, res) => {
createServer(async (req, res) => {
createServer(async (req, res) => {
createServer(async (req, res) => {
createServer(async (req, res) => {
createServer(async (req, res) => {
  try {
  try {
  try {
  try {
  try {
  try {
  try {
  try {
    if (req.method === "POST" && req.url === "/pay/create-intent") {
    if(body.promo){ const { PrismaClient } = await import("@prisma/client"); const { applyPromo } = await import("../../../packages/promo/apply.js"); const db=new PrismaClient(); const p=await db.promo.findUnique({where:{code:body.promo}}); if(p && p.active && (!p.expiresAt || new Date(p.expiresAt)>new Date())){ body.amount = applyPromo(body.amount||100000, p.type as any, p.value); } }
    if (req.method === "POST" && req.url === "/pay/create-intent") {
    if (req.method === "POST" && req.url === "/pay/create-intent") {
    if (req.method === "POST" && req.url === "/pay/create-intent") {
    const chunks=[]; for await (const ch of req) chunks.push(ch); const body=JSON.parse(Buffer.concat(chunks).toString()||"{}"); const it=await P.createIntent({amount:body.amount||100000,currency:body.currency||"UZS"}); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(it));
    try{ const { PrismaClient } = await import("@prisma/client"); const db=new PrismaClient(); await db.revenueEvent.create({data:{type:"booking_fee",amountUZS:it.amount,refId:it.id}});}catch(e){}
    try{ const { PrismaClient } = await import("@prisma/client"); const db=new PrismaClient(); const ag=await db.agencyMember.findFirst({where:{userId:"agent-demo"}}); if(ag){ const rule=await db.commissionRule.findFirst({}); const cut=Math.floor((it.amount||0)*(rule?.percent||0)/100); await db.agencyCommission.create({data:{agencyId:ag.agencyId,bookingId:it.id,amountUZS:cut}});} }catch(e){}
    const chunks=[]; for await (const ch of req) chunks.push(ch); const body=JSON.parse(Buffer.concat(chunks).toString()||"{}"); const it=await P.createIntent({amount:body.amount||100000,currency:body.currency||"UZS"}); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(it));
    const chunks=[]; for await (const ch of req) chunks.push(ch); const body=JSON.parse(Buffer.concat(chunks).toString()||"{}"); const it=await P.createIntent({amount:body.amount||100000,currency:body.currency||"UZS"}); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(it));
    const chunks=[]; for await (const ch of req) chunks.push(ch); const body=JSON.parse(Buffer.concat(chunks).toString()||"{}"); const it=await P.createIntent({amount:body.amount||100000,currency:body.currency||"UZS"}); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(it));
      const payload = await readJson(req);
      const payload = await readJson(req);
      const payload = await readJson(req);
      const payload = await readJson(req);
      const payload = await readJson(req);
      const payload = await readJson(req);
      const payload = await readJson(req);
      const payload = await readJson(req);
      const amount = Number(payload.amount ?? 0);
      const amount = Number(payload.amount ?? 0);
      const amount = Number(payload.amount ?? 0);
      const amount = Number(payload.amount ?? 0);
      const amount = Number(payload.amount ?? 0);
      const amount = Number(payload.amount ?? 0);
      const amount = Number(payload.amount ?? 0);
      const amount = Number(payload.amount ?? 0);
      if (!Number.isFinite(amount) || amount <= 0) {
      if (!Number.isFinite(amount) || amount <= 0) {
      if (!Number.isFinite(amount) || amount <= 0) {
      if (!Number.isFinite(amount) || amount <= 0) {
      if (!Number.isFinite(amount) || amount <= 0) {
      if (!Number.isFinite(amount) || amount <= 0) {
      if (!Number.isFinite(amount) || amount <= 0) {
      if (!Number.isFinite(amount) || amount <= 0) {
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
        return respondJson(res, 400, { ok: false, reason: "invalid_amount" });
      }
      }
      }
      }
      }
      }
      }
      }








      return respondJson(res, 200, {
      return respondJson(res, 200, {
      return respondJson(res, 200, {
      return respondJson(res, 200, {
      return respondJson(res, 200, {
      return respondJson(res, 200, {
      return respondJson(res, 200, {
      return respondJson(res, 200, {
        ok: true,
        ok: true,
        ok: true,
        ok: true,
        ok: true,
        ok: true,
        ok: true,
        ok: true,
        id: "pi_demo_1",
        id: "pi_demo_1",
        id: "pi_demo_1",
        id: "pi_demo_1",
        id: "pi_demo_1",
        id: "pi_demo_1",
        id: "pi_demo_1",
        id: "pi_demo_1",
        clientSecret: "secret_demo",
        clientSecret: "secret_demo",
        clientSecret: "secret_demo",
        clientSecret: "secret_demo",
        clientSecret: "secret_demo",
        clientSecret: "secret_demo",
        clientSecret: "secret_demo",
        clientSecret: "secret_demo",
      });
      });
      });
      });
      });
      });
      });
      });
    }
    }
    }
    }
    }
    }
    }
    }








    if (req.method === "POST" && req.url === "/pay/capture") {
    if (req.method === "POST" && req.url === "/pay/capture") {
    const chunks=[]; for await (const ch of req) chunks.push(ch); const body=JSON.parse(Buffer.concat(chunks).toString()||"{}"); const it=await P.capture(body.id); res.writeHead(200,{"Content-Type":"application\/json"}); return res.end(JSON.stringify(it));
    const chunks=[]; for await (const ch of req) chunks.push(ch); const body=JSON.parse(Buffer.concat(chunks).toString()||"{}"); const it=await P.capture(body.id); res.writeHead(200,{"Content-Type":"application\/json"}); return res.end(JSON.stringify(it));
    if (req.method === "POST" && req.url === "/pay/capture") {
    if (req.method === "POST" && req.url === "/pay/capture") {
    if (req.method === "POST" && req.url === "/pay/capture") {
    if (req.method === "POST" && req.url === "/pay/capture") {
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      return respondJson(res, 200, { ok: true, status: "succeeded" });
      return respondJson(res, 200, { ok: true, status: "succeeded" });
      return respondJson(res, 200, { ok: true, status: "succeeded" });
      return respondJson(res, 200, { ok: true, status: "succeeded" });
    }
    }
    }
    }
    }
    }
    }
    }








    if (req.method === "POST" && req.url === "/pay/webhook") {
    if (req.method === "POST" && req.url === "/pay/webhook") {
    if (req.method === "POST" && req.url === "/pay/webhook") {
    if (req.method === "POST" && req.url === "/pay/webhook") {
    if (req.method === "POST" && req.url === "/pay/webhook") {
    if (req.method === "POST" && req.url === "/pay/webhook") {
    if (req.method === "POST" && req.url === "/pay/webhook") {
    if (req.method === "POST" && req.url === "/pay/webhook") {
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      await readJson(req);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("ok");
      return res.end("ok");
      return res.end("ok");
      return res.end("ok");
      return res.end("ok");
      return res.end("ok");
      return res.end("ok");
      return res.end("ok");
    }
    }
    }
    }
    }
    }
    }
    }








    res.writeHead(404);
  if(req.method==="POST" && req.url==="/pay/refund"){ const chunks=[]; for await (const ch of req) chunks.push(ch); const body=JSON.parse(Buffer.concat(chunks).toString()||"{}"); const it=await P.refund(body.id); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(it)); }
    res.writeHead(404);
    res.writeHead(404);
    res.writeHead(404);
    res.writeHead(404);
    res.writeHead(404);
    res.writeHead(404);
    res.writeHead(404);
    res.end();
    res.end();
    res.end();
    res.end();
    res.end();
    res.end();
    res.end();
    res.end();
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
  } catch (error) {
    console.error("payments_stub_error", error);
    console.error("payments_stub_error", error);
    console.error("payments_stub_error", error);
    console.error("payments_stub_error", error);
    console.error("payments_stub_error", error);
    console.error("payments_stub_error", error);
    console.error("payments_stub_error", error);
    console.error("payments_stub_error", error);
    if (error.message === "payload_too_large") {
    if (error.message === "payload_too_large") {
    if (error.message === "payload_too_large") {
    if (error.message === "payload_too_large") {
    if (error.message === "payload_too_large") {
    if (error.message === "payload_too_large") {
    if (error.message === "payload_too_large") {
    if (error.message === "payload_too_large") {
      res.writeHead(413);
      res.writeHead(413);
      res.writeHead(413);
      res.writeHead(413);
      res.writeHead(413);
      res.writeHead(413);
      res.writeHead(413);
      res.writeHead(413);
      res.end();
      res.end();
      res.end();
      res.end();
      res.end();
      res.end();
      res.end();
      res.end();
      return;
      return;
      return;
      return;
      return;
      return;
      return;
      return;
    }
    }
    }
    }
    }
    }
    }
    }
    if (error.message === "invalid_json") {
    if (error.message === "invalid_json") {
    if (error.message === "invalid_json") {
    if (error.message === "invalid_json") {
    if (error.message === "invalid_json") {
    if (error.message === "invalid_json") {
    if (error.message === "invalid_json") {
    if (error.message === "invalid_json") {
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      respondJson(res, 400, { ok: false, reason: "invalid_json" });
      return;
      return;
      return;
      return;
      return;
      return;
      return;
      return;
    }
    }
    }
    }
    }
    }
    }
    }
    respondJson(res, 500, { ok: false, reason: "internal_error" });
    respondJson(res, 500, { ok: false, reason: "internal_error" });
    respondJson(res, 500, { ok: false, reason: "internal_error" });
    respondJson(res, 500, { ok: false, reason: "internal_error" });
    respondJson(res, 500, { ok: false, reason: "internal_error" });
    respondJson(res, 500, { ok: false, reason: "internal_error" });
    respondJson(res, 500, { ok: false, reason: "internal_error" });
    respondJson(res, 500, { ok: false, reason: "internal_error" });
  }
  }
  }
  }
  }
  }
  }
  }
}).listen(port, "0.0.0.0", () => {
}).listen(port, "0.0.0.0", () => {
}).listen(port, "0.0.0.0", () => {
}).listen(port, "0.0.0.0", () => {
}).listen(port, "0.0.0.0", () => {
}).listen(port, "0.0.0.0", () => {
}).listen(port, "0.0.0.0", () => {
}).listen(port, "0.0.0.0", () => {
  console.log("payments stub listening", port);
  console.log("payments stub listening", port);
  console.log("payments stub listening", port);
  console.log("payments stub listening", port);
  console.log("payments stub listening", port);
  console.log("payments stub listening", port);
  console.log("payments stub listening", port);
  console.log("payments stub listening", port);
});
});
});
});
});
});
});
});

// health

