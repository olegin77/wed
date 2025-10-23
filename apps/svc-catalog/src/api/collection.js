import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const db=new PrismaClient(); const port=process.env.PORT||3170;
createServer(async (req,res)=>{
  if(req.method==="GET" && req.url.startsWith("/collections/")){
    const slug=req.url.split("/").pop(); const c=await db.collection.findUnique({where:{slug:String(slug)}});
    if(!c){ res.writeHead(404); return res.end(); }
    const f=JSON.parse(c.filters||"{}");
    const vendors=await db.vendor.findMany({where:{city:f.city||undefined, category:f.category||undefined, rating:{gte:f.minRating||0}}});
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({title:c.title,items:vendors}));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
