export function bust(url:string){ const sep=url.includes("?")?"&":"?"; return url+sep+"v="+Date.now(); }
