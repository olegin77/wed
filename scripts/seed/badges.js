import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
const list=[{code:"VERIFIED",title:"Проверенный",icon:"✅"},{code:"FAST_REPLY",title:"Быстрый ответ",icon:"⚡"}];
for(const b of list){ const e=await db.vendorBadge.findFirst({where:{code:b.code}}); if(!e) await db.vendorBadge.create({data:b}); }
console.log("seeded badges");
