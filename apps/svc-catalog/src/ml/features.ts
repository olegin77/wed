export type VendorFeat={conv:number;rating:number;profile:number;calendar:number;price:number};
export function features(v:{rating:number;venues?:any[],reviews?:any[]}):VendorFeat{
  const conv=0.2; // примитивный глобальный конверс-фактор (демо)
  const rating=Math.max(0, Math.min(1,(v.rating||0)/5));
  const profile=Math.min(1, ((v.venues?.length||0)>0?1:0)*0.8 + 0.2);
  const calendar=0.5; // нет данных — среднее
  const price=0.5; // нормализованная цена (нет данных — среднее)
  return {conv,rating,profile,calendar,price};
}
