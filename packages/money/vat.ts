export function vat(base:number, rate:number){ const r=Math.max(0,Math.min(100,rate)); return Math.round(base*r/100); }
