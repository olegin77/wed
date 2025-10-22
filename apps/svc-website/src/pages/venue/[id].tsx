import React from "react"; import MapBox from "../../ui/map/MapBox";
export default function VenuePage(){ const v={lat:41.31,lng:69.28,title:"Площадка"}; return <main className="container"><h1 className="text-2xl font-bold mb-4">{v.title}</h1><MapBox lat={v.lat} lng={v.lng}/></main>; }
