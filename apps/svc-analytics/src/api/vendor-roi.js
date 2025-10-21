import { createServer } from "http"; import { calc } from "../roi/vendor.js";
const port=process.env.PORT||3040;
createServer(async (req,res)=>{
  if(req.method==="GET" && req.url.startsWith("/roi?v=")){
    const v=new URL(req.url,"http://x").searchParams.get("v");
    const data={views:1000,enquiries:50,won:10};
    const r=calc(data);
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({vendorId:v, ...r}));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

