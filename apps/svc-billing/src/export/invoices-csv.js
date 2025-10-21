import fs from "fs";
export function exportInvoicesCsv(rows){ const csv="id,amount,currency\n"+rows.map(r=>`${r.id},${r.amount},${r.currency}`).join("\n"); fs.mkdirSync("exports",{recursive:true}); fs.writeFileSync("exports/invoices.csv",csv); return "exports/invoices.csv"; }
