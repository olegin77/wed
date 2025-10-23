import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg; import { DemoProvider } from "../../../packages/pay/demo.js";
const db=new PrismaClient(); const port=process.env.PORT||3210;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/sub/buy"){
    const b=await body(req); // {vendorId, planCode}
    const plan=await db.vendorPlan.findFirst({where:{code:b.planCode}});
    if(!plan){res.writeHead(404);return res.end("no plan");}
    const it=await DemoProvider.createIntent({amount:plan.priceUZS,currency:"UZS"}); await DemoProvider.capture(it.id);
    const ends=new Date(Date.now()+30*24*3600*1000);
    await db.vendorSubscription.create({data:{vendorId:b.vendorId,planId:plan.id,endsAt:ends}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({ok:true,endsAt:ends.toISOString()}));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
