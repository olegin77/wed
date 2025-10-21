import { VendorFeat } from "./features";
const W={conv:1.2,rating:1.0,profile:0.6,calendar:0.3,price:-0.2}, B=0.0;
export function scoreML(f:VendorFeat){ const z=B+W.conv*f.conv+W.rating*f.rating+W.profile*f.profile+W.calendar*f.calendar+W.price*f.price; return 1/(1+Math.exp(-z)); }
