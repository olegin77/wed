import { score } from "./score";
import { features } from "../ml/features";
import { scoreML } from "../ml/model";
export function blended(v:{rating:number;profile?:number;calendar?:number}){
  const base=score({conv:0.2,rating:v.rating,profile:v.profile||0.8,calendar:v.calendar||0.5});
  const ml=scoreML(features(v));
  return 0.6*base + 0.4*ml;
}
