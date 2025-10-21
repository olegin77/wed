import fs from "fs"; export function audit(event:string, payload:any){ fs.appendFileSync("audit.log", JSON.stringify({ts:new Date().toISOString(),event,payload})+"\n"); }
