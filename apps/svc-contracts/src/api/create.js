import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg; import { genContractHTML } from "../../../packages/contracts/generate.js"; import { send } from "../../../packages/mail/index.js";
const db=new PrismaClient(); const port=process.env.PORT||3220;
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/contract/create"){
    const b=await body(req);
    const html=genContractHTML({title:b.title||"Договор оказания услуг"});
    const c=await db.contract.create({data:{bookingId:b.bookingId,title:b.title||"Договор",html,status:"SENT"}});
    await send(b.email,"Договор на подпись",`<p>Откройте: https://weddingtech.uz/contract/${c.id}</p>`);
    res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify(c));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
