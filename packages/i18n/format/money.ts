const formatter = new Intl.NumberFormat("ru-UZ", {
  style: "currency",
  currency: "UZS",
  maximumFractionDigits: 0,
});

export function uzs(value: number): string {
  if (Number.isNaN(value)) return "0 UZS";
  return formatter.format(value);
}
