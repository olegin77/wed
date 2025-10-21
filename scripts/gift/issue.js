import crypto from "crypto"; import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
const code = crypto.randomBytes(6).toString("hex").toUpperCase();
const amount = Number(process.argv[2]||"100000"); const currency = process.argv[3]||"UZS";
const card = await db.giftCard.create({data:{code,amount,currency}});
console.log("ISSUED", card.code, card.amount, card.currency);
