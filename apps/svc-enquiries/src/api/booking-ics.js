import { createServer } from "http"; import { PrismaClient } from "@prisma/client"; import { ics } from "../../../packages/calendar/ics.js";
const db=new PrismaClient(); const port=process.env.PORT||3013;
createServer(async (req,res)=>{
  if(req.method==="GET" && req.url.startsWith("/booking/ics")){
    const id=new URL(req.url,"http://x").searchParams.get("id");
    const b=await db.booking.findUnique({where:{id}}); if(!b){res.writeHead(404);return res.end();}
    const fmt=(dt)=> dt.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z/,"Z");
    const data=ics({title:"Booking",events:[{start:fmt(b.startAt),end:fmt(b.endAt),summary:"Wedding booking"}]});
    res.writeHead(200,{"Content-Type":"text/calendar"}); return res.end(data);
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
