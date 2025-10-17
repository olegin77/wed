export const baseCurrencyRates = {
  UZS: 1,
  USD: 0.000084,
  EUR: 0.000077,
  RUB: 0.0076,
} as const;

export type CurrencyCode = keyof typeof baseCurrencyRates;

export type CurrencyRates = Record<CurrencyCode, number>;

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: CurrencyRates = baseCurrencyRates,
): number {
  if (amount === 0) return 0;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) {
    throw new Error(`Unknown currency pair: ${from} -> ${to}`);
  }
  const uzsAmount = amount / fromRate;
  return Math.round(uzsAmount * toRate * 100) / 100;
}
