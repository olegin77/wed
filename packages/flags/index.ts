const store=new Map<string,boolean>();
export function setFlag(k:string,v:boolean){store.set(k,v);}
export function isOn(k:string){return !!store.get(k);}
