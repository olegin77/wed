import React from "react";
export default function MonthlyCommission({amount}:{amount:number}){ return <div className="p-4 rounded-2xl" style={{background:"#fef9c3"}}>Комиссия за месяц: {new Intl.NumberFormat("ru-UZ").format(amount)} сум</div>; }
