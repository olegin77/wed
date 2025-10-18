export interface PriceItem {
  name: string;
  price: number;
  category?: string;
}

export function parseCsvPrices(input: string): PriceItem[] {
  return input
    .trim()
    .split(/\r?\n/)
    .slice(1) // skip header
    .map((line) => {
      const [name, price, category] = line.split(",");
      return {
        name: name?.trim() ?? "",
        price: Number(price) || 0,
        category: category?.trim() || undefined,
      };
    })
    .filter((item) => item.name.length > 0);
}

export function mergePriceLists(lists: PriceItem[][]): PriceItem[] {
  const map = new Map<string, PriceItem>();
  lists.flat().forEach((item) => {
    map.set(item.name.toLowerCase(), item);
  });
  return Array.from(map.values());
}
