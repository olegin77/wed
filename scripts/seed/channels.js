import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
let ch=await db.channel.findFirst({where:{code:"SALES_AGENCY"}});
if(!ch) ch=await db.channel.create({data:{code:"SALES_AGENCY",title:"Агентства"}});
const have=await db.commissionRule.findFirst({where:{channelId:ch.id}});
if(!have) await db.commissionRule.create({data:{channelId:ch.id,percent:10}});
console.log("seeded channel SALES_AGENCY 10%");
