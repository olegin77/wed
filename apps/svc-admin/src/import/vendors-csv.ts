import fs from "fs"; import { PrismaClient } from "@prisma/client";
const db=new PrismaClient();
export async function importVendorsCsv(path:string){
  const rows=fs.readFileSync(path,"utf-8").trim().split(/\r?\n/);
  for(const r of rows){ const [title,city,category]=r.split(","); await db.vendor.create({data:{title,city,category}}); }
}
