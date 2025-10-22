import fs from "fs";
export function exportGiftcards(rows){ const csv="code,amount,currency,active,ownerId,redeemedAt\n"+rows.map(r=>`${r.code},${r.amount},${r.currency},${r.active},${r.ownerId||""},${r.redeemedAt||""}`).join("\n"); fs.mkdirSync("exports",{recursive:true}); const p="exports/giftcards.csv"; fs.writeFileSync(p,csv); return p; }
