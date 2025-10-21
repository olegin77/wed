import { createServer } from "http"; import { PrismaClient } from "@prisma/client";
import { createServer } from "http"; import { PrismaClient } from "@prisma/client";
const db=new PrismaClient(); const port=process.env.PORT||3002;
const db=new PrismaClient(); const port=process.env.PORT||3002;
function parse(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
function parse(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
function uid(req){const c=(req.headers.cookie||"").split(";").find(c=>c.trim().startsWith("jwt=")); if(!c) return null; return JSON.parse(Buffer.from(c.split(".")[1],"base64").toString()).sub;}
function uid(req){const c=(req.headers.cookie||"").split(";").find(c=>c.trim().startsWith("jwt=")); if(!c) return null; return JSON.parse(Buffer.from(c.split(".")[1],"base64").toString()).sub;}
createServer(async (req,res)=>{
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/enquiry/create"){ const u=uid(req); if(!u){res.writeHead(401);return res.end("unauth");}
    // captcha stub: пропускаем, но место проверки зарезервировано
  if(req.method==="POST" && req.url==="/enquiry/create"){ const u=uid(req); if(!u){res.writeHead(401);return res.end("unauth");}
    const b=await parse(req);
    const b=await parse(req);
    const e=await db.enquiry.create({data:{userId:u, vendorId:b.vendorId, budget:b.budget||null, date:b.date?new Date(b.date):null, status:"NEW"}});
    await db.fraudEvent.create({data:{userId:u,kind:"enquiry_create",payload:"{}"}}); try{ const {adjustTrust}=await import("../fraud/score.js"); await adjustTrust(u); }catch(e){}
    const e=await db.enquiry.create({data:{userId:u, vendorId:b.vendorId, budget:b.budget||null, date:b.date?new Date(b.date):null, status:"NEW"}});
    res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(e));
    res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(e));
  }
  }
  if(req.method==="POST" && req.url==="/enquiry/status"){ const b=await parse(req);
  if(req.method==="POST" && req.url==="/enquiry/status"){ const b=await parse(req);
    const e=await db.enquiry.update({where:{id:b.id}, data:{status:b.status}});
    const e=await db.enquiry.update({where:{id:b.id}, data:{status:b.status}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(e));
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(e));
  }
  }
  res.writeHead(404); res.end();
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
}).listen(port,"0.0.0.0");

// health

