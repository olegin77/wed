import React from "react";
export default function Resources(){ const rows=[{name:"Зал A",capacity:1},{name:"Съемочная группа",capacity:3}];
  return <main className="p-6"><h1 className="text-xl font-bold mb-3">Ресурсы</h1>
    <table className="w-full"><thead><tr><th className="text-left">Название</th><th>Вместимость</th></tr></thead>
      <tbody>{rows.map((r,i)=><tr key={i}><td>{r.name}</td><td className="text-center">{r.capacity}</td></tr>)}</tbody></table>
  </main>;
}
