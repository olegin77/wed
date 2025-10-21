export function byCity(items:{city:string,status:string}[]){
  const acc:Record<string,{enquiries:number,won:number}>={};
  for(const i of items){acc[i.city]??={enquiries:0,won:0};acc[i.city].enquiries++; if(i.status==="WON") acc[i.city].won++; }
  return Object.entries(acc).map(([k,v])=>({city:k,conv: v.enquiries? v.won/v.enquiries:0}));
}
