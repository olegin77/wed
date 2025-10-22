import { createServer } from "http"; import { PrismaClient } from "@prisma/client";
const db=new PrismaClient(); const port=process.env.PORT||3120;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/registry/create"){ const b=await body(req);
    const r=await db.giftRegistry.create({data:{userId:b.userId,title:b.title}}); res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(r)); }
  if(req.method==="POST" && req.url==="/registry/item"){ const b=await body(req);
    const it=await db.giftItem.create({data:{registryId:b.registryId,name:b.name,priceUZS:b.priceUZS,url:b.url||null}}); res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(it)); }
  if(req.method==="POST" && req.url==="/registry/reserve"){ const b=await body(req);
    await db.reservation.create({data:{itemId:b.itemId,name:b.name,phone:b.phone}}); await db.giftItem.update({where:{id:b.itemId},data:{reserved:true}});
    res.writeHead(200); return res.end("ok"); }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

