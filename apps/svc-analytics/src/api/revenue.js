import { createServer } from "http";
const port=process.env.PORT||3185;
createServer(async (req,res)=>{
  if(req.method==="GET" && req.url==="/revenue/summary"){
    const data={GMV: 100_000_000, MRR: 5_000_000, ARPU: 12_000};
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(data));
  }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");
