import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
export async function toUZS(amount:number, code:string){ if(code==="UZS") return amount; const r=await db.currencyRate.findUnique({where:{code}}); return Math.round(amount*(r?.rateUZS||1)); }
export async function fromUZS(amount:number, code:string){ if(code==="UZS") return amount; const r=await db.currencyRate.findUnique({where:{code}}); return Math.round(amount/(r?.rateUZS||1)); }
