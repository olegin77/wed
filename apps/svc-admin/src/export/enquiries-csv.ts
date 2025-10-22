import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
export async function exportEnquiriesCsv(){ const list=await db.enquiry.findMany(); return "id,status,vendorId\\n"+list.map(e=>`${e.id},${e.status},${e.vendorId}`).join("\\n"); }
