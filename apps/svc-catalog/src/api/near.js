import { createServer } from "http"; import { PrismaClient } from "@prisma/client"; import { haversine } from "../../../packages/geo/distance.js";
const db=new PrismaClient(); const port=process.env.PORT||3130;
createServer(async (req,res)=>{
  if(req.method==="GET" && req.url.startsWith("/catalog/near")){
    const u=new URL(req.url,"http://x"); const lat=Number(u.searchParams.get("lat")); const lng=Number(u.searchParams.get("lng")); const km=Number(u.searchParams.get("km")||"10");
    const vendors=await db.vendor.findMany({include:{venues:true}});
    const list=vendors.filter(v=>v.venues.some(p=>p.lat&&p.lng&&haversine(lat,lng,p.lat,p.lng)<=km*1000));
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(list));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

