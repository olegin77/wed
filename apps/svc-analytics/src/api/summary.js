import { createServer } from "http";
import { retention } from "../retention/deltas.js";
const port=process.env.PORT||3100;
createServer(async (req,res)=>{
  if(req.method==="GET" && req.url==="/analytics/retention"){
    const now=Date.now(); const regs=[now-31*86400000, now-8*86400000, now-2*86400000]; const acts=[now-30*86400000, now-1*86400000, now-7*86400000];
    const r=retention(regs,acts); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(r));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

