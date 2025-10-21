import React from "react";
export default function PlanEditor(){
  const [tasks,setTasks]=React.useState([{time:"10:00",title:"Сборы"},{time:"13:00",title:"Церемония"}]);
  return <main className="container"><h1 className="text-2xl font-bold mb-4">Таймлайн</h1>
    <ul>{tasks.map((t,i)=><li key={i} className="mb-2 card">{t.time} — {t.title}</li>)}</ul></main>;
}
