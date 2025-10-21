import fs from "fs";
export function parseTSV(path){ const [_,...rows]=fs.readFileSync(path,"utf-8").trim().split(/\r?\n/); return rows.map(r=>{ const [title,priceUZS,desc]=r.split("\t"); return {title, priceUZS:Number(priceUZS||0), description:desc||""}; }); }
