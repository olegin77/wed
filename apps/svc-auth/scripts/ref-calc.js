import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
const refs=await db.referral.findMany(); const sums=new Map();
for(const r of refs){ sums.set(r.inviterId, (sums.get(r.inviterId)||0)+r.reward); }
for(const [u,amt] of sums){ await db.user.update({where:{id:u}, data:{bonusBalance:amt}}); }
console.log("ref bonus recalculated");
