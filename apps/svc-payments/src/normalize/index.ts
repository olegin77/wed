export function norm(p: any): { id: any; amount: number; status: string } {
  return { id: p.invoice_id || p.bill_id || p.id, amount: +(p.amount || p.total), status: p.status || "ok" };
}
