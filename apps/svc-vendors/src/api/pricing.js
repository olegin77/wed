import { createServer } from "http"; import { PrismaClient } from "@prisma/client";
const db=new PrismaClient(); const port=process.env.PORT||3020;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/pricing/create"){
    const b=await body(req); const pkg=await db.pricePackage.create({data:{vendorId:b.vendorId,title:b.title,price:b.price,currency:b.currency||"UZS"}});
    // TODO: проверить VendorMember (stub допускает всех авторизованных)
    res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(pkg));
  }
  if(req.method==="GET" && req.url.startsWith("/pricing/list")){
    const v=new URL(req.url,"http://x").searchParams.get("vendorId");
    const list=await db.pricePackage.findMany({where:{vendorId:v}, include:{items:true}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(list));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

