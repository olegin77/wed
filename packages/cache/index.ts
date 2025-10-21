const store=new Map<string,{v:any,exp:number}>();
export async function cacheGet<T>(k:string){const e=store.get(k); if(!e) return null; if(Date.now()>e.exp){store.delete(k); return null;} return e.v as T;}
export async function cacheSet<T>(k:string,v:T,ttlMs:number){store.set(k,{v,exp:Date.now()+ttlMs}); return true;}
