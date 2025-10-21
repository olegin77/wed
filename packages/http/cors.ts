export function cors(req:any,res:any,next:Function){
  const origin=req.headers.origin||"*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials","true");
  res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization,X-API-Key");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
  if(req.method==="OPTIONS"){ res.writeHead(200); return res.end(); }
  next();
}
