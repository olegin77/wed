import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
const plans=[{code:"FREE",title:"Free",priceUZS:0, limits:{maxListings:1, highlight:false}},
             {code:"PRO",title:"Pro",priceUZS:490000, limits:{maxListings:10, highlight:true}},
             {code:"BUSINESS",title:"Business",priceUZS:1490000, limits:{maxListings:50, highlight:true}}];
for (const p of plans){
  const exists=await db.vendorPlan.findFirst({where:{code:p.code}});
  if(!exists) await db.vendorPlan.create({data:{...p, limits:JSON.stringify(p.limits)}});
}
console.log("seeded vendor plans");
