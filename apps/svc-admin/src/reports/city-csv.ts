import { byCity } from "../../../apps/svc-analytics/src/agg/city";
export function cityCsv(rows:{city:string,status:string}[]){
  const agg=byCity(rows); return "city,conv\n"+agg.map(r=>`${r.city},${r.conv}`).join("\n");
}
