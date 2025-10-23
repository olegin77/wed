import React from "react";
export default function ChatBox({threadId}:{threadId:string}){
  const [text,setText]=React.useState(""); const [list,setList]=React.useState<any[]>([]);
  async function send(){ await fetch("/chat/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({threadId,authorId:"me",role:"user",text})}); setText(""); refresh(); }
  async function refresh(){ const r=await fetch("/chat/thread?enquiryId=demo"); const t=await r.json(); setList(t?.messages||[]); }
  React.useEffect(()=>{refresh();},[]);
  return <div className="rounded-2xl p-3 border">
    <div className="h-48 overflow-auto mb-2">{list.map((m,i)=><div key={i} className="mb-1"><b>{m.role}:</b> {m.text}{m.mediaUrl&&<img src={m.mediaUrl} alt="" className="rounded-2xl mt-1"/>}</div>)}</div>
    <div className="flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded-2xl px-3"/><button onClick={send} className="px-3 py-2 rounded-2xl text-white" style={{background:"var(--brand)"}}>Отправить</button></div>
  </div>;
}
