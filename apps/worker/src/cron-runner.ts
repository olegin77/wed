import fs from "fs";
const cfg=JSON.parse(fs.readFileSync("configs/schedules.json","utf-8"));
console.log("cron schedules", cfg);
export function runAll(){ console.log("run locks_gc, sms_remind, report_daily (stub)"); }
