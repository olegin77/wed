import fs from "fs"; export function saveHtml(id, html){ const p=`exports/contract-${id}.html`; fs.mkdirSync("exports",{recursive:true}); fs.writeFileSync(p, html); return p; }
