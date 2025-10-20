const shortFormatter = new Intl.DateTimeFormat("ru-UZ", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function dateShort(date: Date): string {
  return shortFormatter.format(date);
}
