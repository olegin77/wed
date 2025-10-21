import React from "react";
export default function Badges({items}:{items:{title:string;icon:string}[]}){ return <div className="flex gap-2">{items.map((b,i)=><span key={i} className="px-2 py-1 rounded-2xl bg-gray-100">{b.icon} {b.title}</span>)}</div>; }
