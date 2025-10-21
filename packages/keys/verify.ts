export function verifyApiKey(req:any, activeKeys:Set<string>){
  const k=(req.headers["x-api-key"]||"").toString(); return activeKeys.has(k);
}
