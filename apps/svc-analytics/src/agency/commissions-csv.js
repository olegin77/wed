import fs from "fs";
export function exportAgencyCSV(rows){ const csv="bookingId,amountUZS,createdAt\n"+rows.map(r=>`${r.bookingId},${r.amountUZS},${r.createdAt.toISOString()}`).join("\n"); fs.mkdirSync("exports",{recursive:true}); const p="exports/agency-commissions.csv"; fs.writeFileSync(p,csv); return p; }
