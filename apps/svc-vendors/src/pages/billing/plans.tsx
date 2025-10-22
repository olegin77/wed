import React from "react";
export default function Plans(){ const plans=[{code:"FREE",title:"Free",price:0},{code:"PRO",title:"Pro",price:490000},{code:"BUSINESS",title:"Business",price:1490000}];
  return <main className="p-6"><h1 className="text-xl font-bold mb-3">Подписки</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{plans.map(p=>
      <div key={p.code} className="p-4 rounded-2xl border"><div className="font-semibold">{p.title}</div><div>{p.price} сум/мес</div></div>)}
    </div></main>;
}
