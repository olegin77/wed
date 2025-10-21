import fs from "fs";
export function exportInvoicesXlsx(rows){ const tsv="id\tamount\tcurrency\n"+rows.map(r=>`${r.id}\t${r.amount}\t${r.currency}`).join("\n"); fs.mkdirSync("exports",{recursive:true}); const p="exports/invoices.xlsx"; fs.writeFileSync(p,tsv); return p; }
