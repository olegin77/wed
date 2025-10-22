const buckets=new Map<string,{t:number,r:number}>();
export function rate({rate=10,burst=20}:{rate?:number;burst?:number}){
  return (req:any,res:any,next:Function)=>{
    const ip=(req.headers["x-forwarded-for"]||req.socket?.remoteAddress||"ip").toString();
    const now=Date.now(); const b=buckets.get(ip)||{t:now,r:burst};
    const dt=Math.max(0, now-b.t); b.t=now; b.r=Math.min(burst, b.r + dt*(rate/1000));
    if(b.r<1){ res.writeHead(429); return res.end("rate"); } b.r-=1; buckets.set(ip,b); next();
  };
}
