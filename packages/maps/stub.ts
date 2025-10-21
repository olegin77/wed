import { MapProvider } from "./provider";
export const StubMap:MapProvider={
  async init(){ return; },
  marker(lat,lng,label){ return {lat,lng,label:label||""}; },
  async route(a,b){ const dx=(a.lat-b.lat), dy=(a.lng-b.lng); return Math.sqrt(dx*dx+dy*dy)*111000; }
};
