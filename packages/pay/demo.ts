import { PaymentProvider, Intent } from "./provider";
const store=new Map<string,Intent>();
export const DemoProvider:PaymentProvider={
  async createIntent({amount,currency}){ const id="pi_"+Math.random().toString(36).slice(2); const it:{id:string;amount:number;currency:string;status:any}={id,amount,currency,status:"requires_payment"}; store.set(id,it as any); return {id,amount,currency,status:"requires_payment"}; },
  async capture(id){ const it=store.get(id); if(!it) throw new Error("nf"); it.status="succeeded" as any; return it as any; },
  async refund(id){ const it=store.get(id); if(!it) throw new Error("nf"); it.status="refunded" as any; return it as any; }
};
