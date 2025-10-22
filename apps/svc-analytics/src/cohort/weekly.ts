export function weekOf(ts:number){ const d=new Date(ts); const onejan=new Date(d.getFullYear(),0,1); const diff=d.getTime()-onejan.getTime(); return d.getFullYear()+"-W"+Math.ceil((diff/86400000+onejan.getDay()+1)/7); }
export function cohort(users:{id:string;createdAt:number}[], events:{userId:string;ts:number}[]){
  const reg= new Map<string,string>(); for(const u of users){ reg.set(u.id, weekOf(u.createdAt)); }
  const buckets=new Map<string,Set<string>>();
  for(const e of events){ const w=reg.get(e.userId); if(!w) continue; if(!buckets.has(w)) buckets.set(w,new Set()); buckets.get(w)!.add(e.userId); }
  return Array.from(buckets.entries()).map(([k,v])=>({cohort:k,active:v.size}));
}
