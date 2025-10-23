import fs from "fs"; import pkg from "@prisma/client";
const { PrismaClient } = pkg; const db=new PrismaClient();
export async function importICS(path,vendorId,userId){ const raw=fs.readFileSync(path,"utf-8"); const lines=raw.split(/\r?\n/); const events=[]; let cur:any={};
  for(const ln of lines){ if(ln.startsWith("BEGIN:VEVENT")) cur={}; else if(ln.startsWith("DTSTART")) cur.start=new Date(ln.split(":")[1]); else if(ln.startsWith("DTEND")) cur.end=new Date(ln.split(":")[1]); else if(ln.startsWith("END:VEVENT")) events.push(cur); }
  for(const e of events){ if(e.start&&e.end) await db.booking.create({data:{vendorId,userId,startAt:e.start,endAt:e.end,status:"PAID"}}); }
  return {imported:events.length};
}
