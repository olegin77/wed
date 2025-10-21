import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
export async function vendorICS(vendorId){
  const bs=await db.booking.findMany({where:{vendorId,status:"PAID"}});
  const fmt=(d)=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z/,"Z");
  const ev=bs.map(b=>`BEGIN:VEVENT\nDTSTART:${fmt(b.startAt)}\nDTEND:${fmt(b.endAt)}\nSUMMARY:Booking\nEND:VEVENT`).join("\n");
  return "BEGIN:VCALENDAR\nVERSION:2.0\n"+ev+"\nEND:VCALENDAR\n";
}
