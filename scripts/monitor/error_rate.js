import fs from "fs"; const lines = fs.readFileSync("audit.log","utf-8").trim().split(/\r?\n/).slice(-500);
const errs = lines.filter(l=>l.includes('"level":"error"')).length; if(errs>10) console.log("ALERT error rate",errs);
