export interface EventRow {
  ts: string;
  event: string;
  payload?: Record<string, unknown>;
}

function escape(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: EventRow[]): string {
  const header = "ts,event,payload";
  const body = rows
    .map((row) => {
      const payload = row.payload ? JSON.stringify(row.payload) : "";
      return [row.ts, row.event, payload].map(escape).join(",");
    })
    .join("\n");
  return `${header}\n${body}`;
}
