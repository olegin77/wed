import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg; import { sendCode } from "./send.js";
const db=new PrismaClient(); const port=process.env.PORT||3160;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/verify/send"){ const b=await body(req); const r=await sendCode(b); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(r)); }
  if(req.method==="POST" && req.url==="/verify/check"){ const b=await body(req);
    const v=await db.verificationCode.findUnique({where:{id:b.id}}); const ok=!!v && !v.used && v.code===b.code && v.expiresAt>new Date();
    if(ok){ await db.verificationCode.update({where:{id:b.id},data:{used:true}}); }
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({ok}));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
