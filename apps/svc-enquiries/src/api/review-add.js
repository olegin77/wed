import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const db=new PrismaClient(); const port=process.env.PORT||3090;
function uid(req){const c=(req.headers.cookie||"").split(";").find(c=>c.trim().startsWith("jwt=")); if(!c) return null; return JSON.parse(Buffer.from(c.split(".")[1],"base64").toString()).sub;}
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/review/add"){
    // rate: stub — ограничение 3/час (проверку опустим)
    // captcha stub: проверка ответа (пропускаем в MVP)
    const u=uid(req); if(!u){res.writeHead(401);return res.end();}
    const b=await body(req);
    const e=await db.enquiry.findUnique({where:{id:b.enquiryId}});
    if(!e || (e.status!=="WON" && e.status!=="CONTRACT_SIGNED")){res.writeHead(403);return res.end();}
    const r=await db.review.create({data:{vendorId:e.vendorId,rating:b.rating,text:b.text,contractBased:true}});
    try{ await db.moderationQueue.create({data:{entity:"review",refId:r.id,reason:"auto:new_review"}});}catch(e){}
    res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(r));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

