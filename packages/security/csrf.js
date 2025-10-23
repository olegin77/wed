import crypto from "crypto";
export function issue() { const v = crypto.randomBytes(16).toString("hex"); return { cookie: `csrf=${v}; Path=/; SameSite=Lax`, value: v }; }
export function verify(serverToken, clientToken) { return serverToken && clientToken && serverToken === clientToken; }
