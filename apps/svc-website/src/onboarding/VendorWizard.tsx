import React from "react"; export default function VendorWizard(){
  const [step,setStep]=React.useState(1);
  return <div className="max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Регистрация поставщика</h1>
    <div className="card mb-4">Шаг {step} из 3</div>
    <div className="flex gap-2">
      <button className="px-3 py-2 rounded-2xl bg-[var(--brand)] text-white" onClick={()=>setStep(Math.max(1,step-1))}>Назад</button>
      <button className="px-3 py-2 rounded-2xl bg-[var(--brand)] text-white" onClick={()=>setStep(Math.min(3,step+1))}>Далее</button>
    </div>
  </div>;
}
