import pkg from "@prisma/client";
const { PrismaClient } = pkg; import { parseTSV } from "./price-tsv.js"; const db=new PrismaClient();
export async function ingest(vendorId, path){ const items=parseTSV(path); for(const it of items){ await db.pricePackage.create({data:{vendorId,title:it.title,priceUZS:it.priceUZS,description:it.description}}); } return {imported:items.length}; }
