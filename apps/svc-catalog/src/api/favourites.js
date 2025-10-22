import { createServer } from "http"; import { PrismaClient } from "@prisma/client";
const db=new PrismaClient(); const port=process.env.PORT||3001;
function userIdFromCookie(req){const c=(req.headers["cookie"]||"").split(";").find(c=>c.trim().startsWith("jwt=")); if(!c) return null; return JSON.parse(Buffer.from(c.split(".")[1],"base64").toString()).sub;}
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  const uid=userIdFromCookie(req); if(!uid){res.writeHead(401); return res.end("unauth");}
  if(req.method==="POST" && req.url==="/fav/add"){ const b=await body(req);
    await db.favourite.create({data:{userId:uid, vendorId:b.vendorId}}); res.writeHead(200); return res.end("ok"); }
  if(req.method==="POST" && req.url==="/fav/remove"){ const b=await body(req);
    await db.favourite.deleteMany({where:{userId:uid, vendorId:b.vendorId}}); res.writeHead(200); return res.end("ok"); }
  if(req.method==="GET" && req.url==="/fav/list"){
    const list=await db.favourite.findMany({where:{userId:uid}, include:{vendor:true}}); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(list)); }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
