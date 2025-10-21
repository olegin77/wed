import { createServer } from "http"; import { PrismaClient } from "@prisma/client";
const db=new PrismaClient(); const port=process.env.PORT||3021;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/promo/apply"){
    const b=await body(req);
    const p=await db.promoCode.findUnique({where:{code:b.code}});
    const ok=!!p && p.validTill>new Date() && (!p.vendorId || p.vendorId===b.vendorId);
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({ok,discount: ok?p.discount:0}));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

