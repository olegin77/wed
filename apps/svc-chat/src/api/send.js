import { createServer } from "http"; import { PrismaClient } from "@prisma/client";
const db=new PrismaClient(); const port=process.env.PORT||3151;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/chat/send"){
    const b=await body(req);
    const m=await db.chatMessage.create({data:{threadId:b.threadId,authorId:b.authorId,role:b.role||"user",text:b.text||null,mediaUrl:b.mediaUrl||null}});
    try{ if(b.role==="vendor"){ const t=await db.chatThread.findUnique({where:{id:b.threadId}}); const first=await db.chatMessage.findFirst({where:{threadId:b.threadId}, orderBy:{createdAt:"asc"}}); const sec=Math.max(0, Math.round(((new Date())-first.createdAt)/1000)); await db.responseMetric.create({data:{threadId:b.threadId,firstReplySec:sec}});} }catch(e){}
    res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(m));
  }
  res.writeHead(404);res.end();
}).listen(port,"0.0.0.0");
