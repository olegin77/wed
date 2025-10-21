import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
export async function adjustTrust(userId:string){
  const since=new Date(Date.now()-3600_000); // 1 час
  const cnt=await db.enquiry.count({where:{userId, createdAt:{gte:since}}});
  const pen = cnt>5 ? 20 : cnt>3 ? 10 : 0;
  await db.user.update({where:{id:userId}, data:{trustScore:{decrement:pen}}});
  return {penalty:pen};
}
