import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const db=new PrismaClient(); const port=process.env.PORT||3221;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/contract/sign"){
    const b=await body(req);
    const c=await db.contract.update({where:{id:b.id}, data:{status:"SIGNED", signedAt:new Date()}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({ok:true, signedAt:c.signedAt}));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
