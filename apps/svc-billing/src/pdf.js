import fs from "fs"; import { invoiceHtml } from "../../../packages/invoice/html.js";
export async function genInvoice(id, amount, currency){
  const html=invoiceHtml({id,amount,currency});
  const path=`invoices/${id}.html`; fs.mkdirSync("invoices",{recursive:true}); fs.writeFileSync(path, html); return {ok:true, path};
}
