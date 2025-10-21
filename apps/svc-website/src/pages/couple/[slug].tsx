import React from "react"; import { Hero, Text, Gallery } from "../../couples/blocks";
export default function CouplePage(){ const data={theme:"classic", blocks:[{t:"Hero",p:{title:"Айгул & Тимур",subtitle:"Наш день"}},{t:"Text",p:{html:"<p>Добро пожаловать на наш сайт!</p>"}},{t:"Gallery",p:{images:[{src:"/icon-192.png",alt:""}]}}]}; 
  return <main className="container">{data.blocks.map((b,i)=> b.t==="Hero"?<Hero key={i} {...b.p}/>: b.t==="Text"?<Text key={i} {...b.p}/>:<Gallery key={i} {...b.p}/>)}</main>; }
  const q=new URLSearchParams(typeof window!=="undefined"? window.location.search:""); const lang=q.get("lang")||"ru";
