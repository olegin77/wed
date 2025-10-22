export function byPeriod(rows:{createdAt:string;amountUZS:number}[], period:"day"|"month"="day"){
  const key=(d:Date)=> period==="day"? d.toISOString().slice(0,10): d.toISOString().slice(0,7);
  const acc=new Map<string,number>(); for(const r of rows){ const k=key(new Date(r.createdAt)); acc.set(k,(acc.get(k)||0)+r.amountUZS); }
  return Array.from(acc.entries()).map(([k,v])=>({period:k,amountUZS:v}));
}
