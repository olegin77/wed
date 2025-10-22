import { createServer } from "http";
const port=process.env.PORT||3050; const sessions=new Map(); // id -> msgs[]
function id(){return Math.random().toString(36).slice(2)}
function body(req){return new Promise(r=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>r(JSON.parse(b||"{}")))})}
createServer(async (req,res)=>{
  if(req.method==="POST" && req.url==="/chat/start"){ const sid=id(); sessions.set(sid,[]); res.writeHead(201,{"Content-Type":"application/json"}); return res.end(JSON.stringify({sid})); }
  if(req.method==="POST" && req.url==="/chat/append"){ const b=await body(req); const a=sessions.get(b.sid)||[]; a.push({role:b.role||"user",text:b.text||""}); sessions.set(b.sid,a); res.writeHead(200).end("ok"); return; }
  if(req.method==="GET" && req.url.startsWith("/chat/list?sid=")){ const sid=new URL(req.url,"http://x").searchParams.get("sid"); res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(sessions.get(sid)||[])); }
  res.writeHead(404); res.end();
}).listen(port,"0.0.0.0");

// health

