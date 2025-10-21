import http from "http";
export async function chInsert(rows){ const body=(rows||[]).map(r=>JSON.stringify(r)).join("\n"); const req=http.request({hostname:"localhost",port:8123,path:"/?query=INSERT%20INTO%20events%20FORMAT%20JSONEachRow",method:"POST",headers:{"Content-Type":"application/json"}},res=>res.resume()); req.on("error",()=>{}); req.write(body); req.end(); }
