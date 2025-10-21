import React from "react";
export default function ExportButtons(){
  return <div className="flex gap-2">
    <a className="px-3 py-2 rounded-2xl text-white" style={{background:"var(--brand)"}} href="/exports/invoices.csv" download>CSV</a>
    <a className="px-3 py-2 rounded-2xl text-white" style={{background:"var(--brand)"}} href="/exports/invoices.xlsx" download>XLSX</a>
  </div>;
}
