export function payoutsCsv(rows: any[]) {
  return ['invoice_id,amount,currency,beneficiary']
    .concat(rows.map((r) => [r.id, r.amount, r.ccy, r.benef].join(',')))
    .join('\n');
}
