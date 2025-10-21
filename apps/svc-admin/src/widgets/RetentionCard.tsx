import React from "react";
export default function RetentionCard({d1,d7,d30}:{d1:number;d7:number;d30:number}){
  const p=(x:number)=> (x*100).toFixed(1)+"%";
  return <div className="p-4 rounded-2xl" style={{background:"#eef2ff"}}><h3 className="font-semibold mb-2">Retention</h3>
    <div>D1: {p(d1)}</div><div>D7: {p(d7)}</div><div>D30: {p(d30)}</div></div>;
}
