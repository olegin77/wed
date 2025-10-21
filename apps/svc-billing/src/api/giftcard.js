import { createServer } from "http"; import { PrismaClient } from "@prisma/client";
const db=new PrismaClient(); const port=process.env.PORT||3188;
function uid(req){const c=(req.headers.cookie||"").split(";").find(x=>x.trim().startsWith("jwt=")); if(!c) return null; return JSON.parse(Buffer.from(c.split(".")[1],"base64").toString()).sub;}
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/gift/redeem"){
    const userId=uid(req); if(!userId){res.writeHead(401);return res.end();}
    const b=await body(req);
    const card=await db.giftCard.findUnique({where:{code:b.code}});
    if(!card || !card.active){ res.writeHead(409); return res.end("invalid"); }
    await db.giftCard.update({where:{id:card.id}, data:{active:false,redeemedAt:new Date(),ownerId:userId}});
    await db.user.update({where:{id:userId}, data:{bonusBalance:{increment:card.amount}}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({ok:true,amount:card.amount}));
  }
  res.writeHead(404);res.end();
}).listen(port,"0.0.0.0");
