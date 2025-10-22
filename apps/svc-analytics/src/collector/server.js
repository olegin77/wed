import { createServer } from "http"; const port=process.env.PORT||3080; const buffer=[];
import {PrismaClient} from "@prisma/client";
const db=new PrismaClient();
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/analytics"){
    const chunks=[]; for await (const c of req) chunks.push(c);
    const row=JSON.parse(Buffer.concat(chunks).toString()||"{}"); buffer.push(row);
    if(row.evt==="click_vendor"){ /* уже пишем в EventLog */ }
    try{ await db.eventLog.create({data:{userId:row.payload?.userId||null,name:row.evt||"evt",payload:JSON.stringify(row),city:row.payload?.city||null}}); }catch(e){}
    res.writeHead(204); return res.end();
  }
  if(req.method==="GET" && req.url==="/analytics/dump"){
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(buffer.slice(-200)));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
