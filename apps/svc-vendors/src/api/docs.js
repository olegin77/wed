import { createServer } from "http"; import { putObject } from "../../../packages/storage/s3.js";
const port=process.env.PORT||3005;
async function read(req){return new Promise(r=>{const ch=[];req.on("data",c=>ch.push(c));req.on("end",()=>r(Buffer.concat(ch)))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/vendors/doc/upload"){
    const buf=await read(req); const r=await putObject(buf, `docs/${Date.now()}.pdf`);
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(r));
  }
  if(req.method==="POST" && req.url==="/vendors/doc/verify"){
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({ok:true,verified:true}));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

