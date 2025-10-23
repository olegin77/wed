import pkg from "@prisma/client";
const { PrismaClient } = pkg; const db=new PrismaClient();
const main=async()=>{ await db.slotLock.deleteMany({where:{lockedUntil:{lt:new Date()}}}); console.log("locks gc done"); };
main().then(()=>process.exit(0));
