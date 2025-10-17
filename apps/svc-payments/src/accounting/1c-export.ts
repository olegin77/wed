export interface AccountingRow {
  date: string; // YYYY-MM-DD
  doc: string;
  amount: number;
  ccy: string;
  counterparty: string;
}

const HEADER = "DATE;DOC;AMOUNT;CCY;COUNTERPARTY";

function formatAmount(amount: number) {
  return amount.toFixed(2).replace(",", ".");
}

export function to1C(rows: AccountingRow[]): string {
  const lines = rows.map((row) =>
    [row.date, row.doc, formatAmount(row.amount), row.ccy, row.counterparty].join(";")
  );
  return [HEADER, ...lines].join("\n");
}
