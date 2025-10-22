const counters=new Map<string,number>(); const gauges=new Map<string,number>();
export function inc(k:string,v=1){ counters.set(k,(counters.get(k)||0)+v); }
export function setGauge(k:string,v:number){ gauges.set(k,v); }
export function render(){ return "counters "+JSON.stringify(Object.fromEntries(counters))+"; gauges "+JSON.stringify(Object.fromEntries(gauges)); }
