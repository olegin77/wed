import http from "http"; import { send } from "../../packages/mail/index.js";
const URL=process.env.UPTIME_URL||"http://localhost:3000/health";
http.get(URL, res=>{ if(res.statusCode!==200){ send(process.env.ADMIN_EMAIL||"admin@example.com","Uptime alert",`Down: ${URL}`); } }).on("error",()=>send(process.env.ADMIN_EMAIL||"admin@example.com","Uptime alert","Down"));
