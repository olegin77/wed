import fs from "fs";
export function toNDJSON(rows){ const s=(rows||[]).map(r=>JSON.stringify(r)).join("\n"); fs.mkdirSync("exports",{recursive:true}); const p="exports/events.ndjson"; fs.writeFileSync(p,s); return p; }
