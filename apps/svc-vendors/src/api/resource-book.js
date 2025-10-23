import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const db=new PrismaClient(); const port=process.env.PORT||3230;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/resource/book"){
    const b=await body(req); // {resourceId, date, qty}
    const cap=(await db.resource.findUnique({where:{id:b.resourceId}}))?.capacity||1;
    const taken=await db.resourceBooking.aggregate({where:{resourceId:b.resourceId,date:new Date(b.date)}, _sum:{qty:true}});
    if((taken._sum.qty||0)+Number(b.qty||1) > cap){ res.writeHead(409); return res.end("no capacity"); }
    const rb=await db.resourceBooking.create({data:{resourceId:b.resourceId,date:new Date(b.date),qty:Number(b.qty||1)}});
    res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(rb));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
