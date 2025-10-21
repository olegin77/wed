import { createServer } from "http";
const port=process.env.PORT||3152;
createServer((req,res)=>{
  if(req.method==="POST" && req.url==="/media/presign"){
    const url="/uploads/"+Math.random().toString(36).slice(2)+".jpg";
    res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({uploadUrl:url, publicUrl:url}));
  }
  res.writeHead(404);res.end();
}).listen(port,"0.0.0.0");
