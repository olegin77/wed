export function invoiceHtml({id,amount,currency}:{id:string;amount:number;currency:string}){
  return `<!doctype html><html><body><h1>Invoice ${id}</h1><p>Amount: ${amount} ${currency}</p><p>Promo: applied if present</p></body></html>`;
}
