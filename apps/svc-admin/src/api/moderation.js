import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const db=new PrismaClient(); const port=process.env.PORT||3190;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/moderation/decide"){
    const b=await body(req);
    const m=await db.moderationQueue.update({where:{id:b.id}, data:{state:b.state,decidedAt:new Date(),moderator:"admin"}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(m));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
