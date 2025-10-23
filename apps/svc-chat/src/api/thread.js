import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const db=new PrismaClient(); const port=process.env.PORT||3150;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/chat/thread"){
    const b=await body(req);
    let t=await db.chatThread.findFirst({where:{enquiryId:b.enquiryId}});
    if(!t) t=await db.chatThread.create({data:{enquiryId:b.enquiryId}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(t));
  }
  if(req.method==="GET" && req.url.startsWith("/chat/thread?enquiryId=")){
    const id=new URL(req.url,"http://x").searchParams.get("enquiryId");
    const t=await db.chatThread.findFirst({where:{enquiryId:id}, include:{messages:true}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(t||null));
  }
  res.writeHead(404);res.end();
}).listen(port,"0.0.0.0");
