import pkg from "@prisma/client";
const { PrismaClient } = pkg; import fs from "fs"; import { eskiz } from "../../../packages/sms/adapters/eskiz.js";
const db=new PrismaClient();
const text=fs.readFileSync("packages/sms/templates/booking_reminder.txt","utf-8").trim();
const now=Date.now(), day=24*3600*1000; const from=new Date(now+day-3600*1000), to=new Date(now+day+3600*1000);
const bookings=await db.booking.findMany({where:{startAt:{gte:from,lte:to}}});
for(const b of bookings){ /* lookup phone omitted in MVP */ await eskiz.send("+998000000000", text); }
console.log("reminders sent", bookings.length);
