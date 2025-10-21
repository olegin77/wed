import fs from "fs";
export function exportTimeline(tasks){ const html="<!doctype html><html><body><h1>Timeline</h1><ul>"+tasks.map(t=>`<li>${t.time} — ${t.title}</li>`).join("")+"</ul></body></html>"; fs.mkdirSync("exports",{recursive:true}); const p="exports/timeline.html"; fs.writeFileSync(p,html); return p; }
