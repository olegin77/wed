export function qrDataUrl(text:string){ const b=Buffer.from("QR:"+text).toString("base64"); return "data:image/png;base64,"+b; }
