import { createServer } from "http"; import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { similarity } from "../reco/sim.js";
const db=new PrismaClient(); const port=process.env.PORT||3110;
function uid(req){const c=(req.headers.cookie||"").split(";").find(c=>c.trim().startsWith("jwt=")); if(!c) return null; return JSON.parse(Buffer.from(c.split(".")[1],"base64").toString()).sub;}
createServer(async (req,res)=>{
  if(req.method==="GET" && req.url==="/catalog/personal"){
    const u=uid(req);
    const prefs = u? await db.userPrefs.findUnique({where:{userId:u}}) : null;
    const cats = prefs?.cats ? JSON.parse(prefs.cats) : [];
    const vendors = await db.vendor.findMany({take:100});
    const scored = vendors.map(v=>({v, s: similarity(cats, v.category) + (v.rating||0)/10 }));
    scored.sort((a,b)=>b.s-a.s);
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(scored.map(x=>x.v).slice(0,20)));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

