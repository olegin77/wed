import React from "react";
export default function AvgReply({avg}:{avg:number}){ const m=Math.floor(avg/60), s=avg%60; return <div className="p-4 rounded-2xl" style={{background:"#ecfeff"}}>Среднее время ответа: {m}м {s}с</div>; }
