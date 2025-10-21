export function retention(regTs:number[], actTs:number[]){
  const day=(n:number)=>n*86400000;
  const have=(ts:number,delta:number)=> actTs.some(a=>a>=ts+delta && a<ts+delta+day(1));
  let d1=0,d7=0,d30=0; for(const ts of regTs){ if(have(ts,day(1))) d1++; if(have(ts,day(7))) d7++; if(have(ts,day(30))) d30++; }
  const n=regTs.length||1; return {d1:d1/n, d7:d7/n, d30:d30/n};
}
