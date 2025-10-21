import React from "react";
export default function ReviewCard({rating,text,images}:{rating:number;text:string;images?:string[]}){
  return <div className="p-4 rounded-2xl" style={{background:"var(--card)"}}>
    <div className="font-semibold mb-1">★ {rating}</div>
    <p className="mb-2">{text}</p>
    {images && images.length>0 && <div className="gap-2 columns-2">{images.map((src,i)=><img key={i} src={src} alt="" className="rounded-2xl mb-2"/>)}</div>}
  </div>;
}
