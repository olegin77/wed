import React from "react";
export default function RevenueCard({GMV,MRR,ARPU}:{GMV:number;MRR:number;ARPU:number}){
  const f=(n:number)=> new Intl.NumberFormat("ru-UZ").format(n)+" сум";
  return <div className="p-4 rounded-2xl" style={{background:"#f0fdf4"}}>
    <div>GMV: {f(GMV)}</div><div>MRR: {f(MRR)}</div><div>ARPU: {f(ARPU)}</div>
  </div>;
}
