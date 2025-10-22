import { createServer } from "http"; import { verify } from "../../../packages/webhooks/sign.js";
const port=process.env.PORT||3105; const SECRET=process.env.WEBHOOK_SECRET||"secret";
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/webhook/inbound"){
    const chunks=[]; for await (const c of req) chunks.push(c); const body=Buffer.concat(chunks).toString();
    const sig=req.headers["x-signature"]||""; if(!verify(body, String(sig), SECRET)){ res.writeHead(401); return res.end("bad sig"); }
    res.writeHead(200); return res.end("ok");
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
