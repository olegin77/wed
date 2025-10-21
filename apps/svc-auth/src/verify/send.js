import { PrismaClient } from "@prisma/client"; import { send as sendMail } from "../../../packages/mail/index.js"; import { eskiz } from "../../../packages/sms/adapters/eskiz.js";
const db=new PrismaClient();
function code(){ return (Math.floor(100000+Math.random()*900000)).toString(); }
export async function sendCode({channel,target,userId}){
  const c=code(); const vc=await db.verificationCode.create({data:{userId:userId||null,channel,target,code:c,expiresAt:new Date(Date.now()+10*60*1000)}});
  if(channel==="email") await sendMail(target,"Код подтверждения",`<p>Код: <b>${c}</b></p>`); else await eskiz.send(target, `Код: ${c}`);
  return {id:vc.id};
}
