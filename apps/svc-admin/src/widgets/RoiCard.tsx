import React from "react";
export function RoiCard({views,enquiries,won,conv}:{views:number;enquiries:number;won:number;conv:number}){
  return <div className="p-4 rounded-2xl" style={{background:"#f3f4f6"}}>
    <div>Просмотры: {views}</div><div>Заявки: {enquiries}</div><div>Сделки: {won}</div><div>Конверсия: {(conv*100).toFixed(1)}%</div>
  </div>;
}
