import { createServer } from "http"; import { putObject } from "../../../packages/storage/s3.js";
const port=process.env.PORT||3003;
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/vendors/upload-cover"){
    const chunks=[]; for await (const c of req) chunks.push(c);
    const buf=Buffer.concat(chunks);
    const r=await putObject(buf, `covers/${Date.now()}.jpg`);
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(r));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

