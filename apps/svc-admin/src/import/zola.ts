import fs from "fs"; import { PrismaClient } from "@prisma/client"; const db=new PrismaClient();
export async function importZolaJson(path:string){
  const data=JSON.parse(fs.readFileSync(path,"utf-8")); // [{title,city,category,venues:[{name,capacity,address}]}]
  for(const v of data){ const ven=await db.vendor.create({data:{title:v.title,city:v.city,category:v.category,rating:4}});
    for(const p of (v.venues||[])){ await db.venue.create({data:{vendorId:ven.id,name:p.name,capacity:p.capacity||150,address:p.address||""}}); }
  }
}
