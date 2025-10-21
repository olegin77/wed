import crypto from "crypto";
export function bucket(userId:string, modulo=100){ const h=crypto.createHash("sha1").update(userId).digest(); return h[0]%modulo; }
