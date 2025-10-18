const CSV_HEADER = ['date', 'type', 'amountUZS', 'vendorId', 'enquiryId'];

type FinanceRow = {
  date: string;
  type: string;
  amountUZS: number;
  vendorId: string;
  enquiryId?: string | null;
};

const escapeCsv = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export const financeCsv = (rows: FinanceRow[]): string => {
  const lines = [CSV_HEADER.join(',')];
  for (const row of rows) {
    lines.push(
      [row.date, row.type, row.amountUZS, row.vendorId, row.enquiryId ?? '']
        .map(escapeCsv)
        .join(',')
    );
  }
  return `${lines.join('\n')}\n`;
};
