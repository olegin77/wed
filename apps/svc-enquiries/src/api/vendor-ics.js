import { createServer } from "http"; import { vendorICS } from "../export/vendor-ics.js";
const port=process.env.PORT||3180;
createServer(async (req,res)=>{
  if(req.method==="GET" && /^\/vendor\/[^/]+\/calendar\.ics$/.test(req.url||"")){
    const id=(req.url||"").split("/")[2]; const ics=await vendorICS(id); res.writeHead(200,{"Content-Type":"text/calendar"}); return res.end(ics);
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
