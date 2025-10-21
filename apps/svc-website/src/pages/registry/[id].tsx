import React from "react"; import { qrDataUrl } from "../../../../packages/qr";
export default function RegistryPage(){ const id="demo"; const url="https://weddingtech.uz/registry/"+id; const qr=qrDataUrl(url);
  return <main className="container"><h1 className="text-2xl font-bold mb-4">Список подарков</h1><img src={qr} alt="QR" className="w-32 h-32"/></main>;
}
