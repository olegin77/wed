import fs from "fs";
export function genContractHTML(vars:{title:string}){ const tpl=fs.readFileSync("packages/contracts/template.html","utf-8"); return tpl.replace("Договор оказания услуг", vars.title||"Договор оказания услуг"); }
