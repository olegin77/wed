export function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const headerLine = headers.join(",");
  const lines = rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? "")).join(","));
  return [headerLine, ...lines].join("\n");
}
