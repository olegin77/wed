import { createServer } from "http";
import { sendPush } from "../../../packages/push/index.js";
import { applySecurityHeaders } from "../../../packages/security/headers.js";

const port = process.env.PORT || 3060;
const subs = new Map(); // userId -> Subscription

function body(req) { return new Promise(r => { let b = ""; req.on("data", c => b += c); req.on("end", () => r(JSON.parse(b || "{}"))); }); }
function uid(req) { const c = (req.headers.cookie || "").split(";").find(c => c.trim().startsWith("jwt=")); if (!c) return "guest"; return JSON.parse(Buffer.from(c.split(".")[1], "base64").toString()).sub || "guest"; }

createServer(async (req, res) => {
  applySecurityHeaders(res);
  if(req.method==="POST" && req.url==="/push/subscribe"){
    const u=uid(req); subs.set(u, await body(req)); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({ok:true}));
  }
  if(req.method==="POST" && req.url==="/push/test"){
    const u=uid(req); const s=subs.get(u); if(!s){res.writeHead(404);return res.end("no sub");}
    await sendPush(s,{title:"WeddingTech",body:"Test notification",url:"/"}); res.writeHead(200); return res.end("ok");
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

