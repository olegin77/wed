import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
const main=async()=>{ await db.slotLock.deleteMany({where:{lockedUntil:{lt:new Date()}}}); console.log("locks gc done"); };
main().then(()=>process.exit(0));
