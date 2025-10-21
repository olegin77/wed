import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
export async function assignFastReply(vendorId){
  const met=await db.responseMetric.findMany(); const avg=Math.round(met.reduce((a,m)=>a+m.firstReplySec,0)/Math.max(1,met.length));
  if(avg<1800){ const b=await db.vendorBadge.findFirst({where:{code:"FAST_REPLY"}}); if(b) await db.vendorBadgeLink.create({data:{vendorId,badgeId:b.id}}); }
  return {avg};
}
