import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
export async function botReply(threadId){
  const v={title:"Вендор", city:"Tashkent", minPriceUZS:1000000}; // demo lookup
  const answers={
    price:`Минимальный пакет стоит ${v.minPriceUZS} сум.`,
    city:`Мы работаем в городе ${v.city}.`,
    booking:`Чтобы забронировать дату, оставьте заявку и внесите предоплату.`
  };
  const last=await db.chatMessage.findFirst({where:{threadId}, orderBy:{createdAt:"desc"}});
  const text=(last?.text||"").toLowerCase();
  const pick = text.includes("сколько")||text.includes("цена")? "price" : text.includes("город")? "city" : text.includes("заброни")? "booking" : null;
  if(!pick) return null;
  const m=await db.chatMessage.create({data:{threadId,authorId:"bot",role:"vendor",text:answers[pick]}});
  return m;
}
