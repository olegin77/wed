export function log(req:any,res:any){ console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`); }
