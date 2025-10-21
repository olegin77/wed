import fs from "fs"; import { eskiz } from "../../../../packages/sms/adapters/eskiz";
export async function smsOnCreate(phone:string){
  const text=fs.readFileSync("packages/sms/templates/enquiry_created.txt","utf-8").trim();
  return eskiz.send(phone, text);
}
