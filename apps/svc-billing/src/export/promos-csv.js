import fs from "fs";
export function exportPromos(rows){ const csv="code,type,value,active,expiresAt\n"+rows.map(r=>`${r.code},${r.type},${r.value},${r.active},${r.expiresAt||""}`).join("\n"); fs.mkdirSync("exports",{recursive:true}); const p="exports/promos.csv"; fs.writeFileSync(p,csv); return p; }
