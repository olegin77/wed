import React from "react"; import { VendorCard } from "../ui/vendor/VendorCard";
export default function TopList({items}:{items:{title:string;city:string;verified:boolean;rating:number}[]}){
  return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{items.map((v,i)=><VendorCard key={i} {...v}/>)}</div>;
}
