import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const db=new PrismaClient(); const port=process.env.PORT||3030;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/ref/invite"){
    const b=await body(req); const r=await db.referral.create({data:{inviterId:b.inviterId, inviteeId:b.inviteeId, reward:0}});
    res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(r));
  }
  if(req.method==="POST" && req.url==="/ref/reward"){
    const b=await body(req); const r=await db.referral.update({where:{id:b.id},data:{reward:b.amount}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(r));
  }
  res.writeHead(404);res.end();
}).listen(port,"0.0.0.0");
