/**
 * Currency formatting utilities
 */
export type SupportedCurrency = "UZS" | "RUB" | "KZT" | "USD" | "EUR";

export interface FormatOptions extends Omit<Intl.NumberFormatOptions, "style" | "currency"> {
  locale?: string;
  rangeSeparator?: string;
}

export const CURRENCY_METADATA: Record<SupportedCurrency, {
  locale: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  symbol: string;
}> = {
  UZS: { locale: 'uz-UZ', minimumFractionDigits: 0, maximumFractionDigits: 0, symbol: 'сум' },
  RUB: { locale: 'ru-RU', minimumFractionDigits: 0, maximumFractionDigits: 2, symbol: '₽' },
  KZT: { locale: 'kk-KZ', minimumFractionDigits: 0, maximumFractionDigits: 0, symbol: '₸' },
  USD: { locale: 'en-US', minimumFractionDigits: 2, maximumFractionDigits: 2, symbol: '$' },
  EUR: { locale: 'en-EU', minimumFractionDigits: 2, maximumFractionDigits: 2, symbol: '€' },
};

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
  options?: FormatOptions
): string {
  const metadata = CURRENCY_METADATA[currency];
  const locale = options?.locale || metadata.locale;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: metadata.minimumFractionDigits,
    maximumFractionDigits: metadata.maximumFractionDigits,
    ...options,
  }).format(amount);
}

export function formatCurrencyRange(
  minimum: number,
  maximum: number,
  currency: SupportedCurrency,
  options?: FormatOptions
): string {
  const rangeSeparator = options?.rangeSeparator || ' — ';
  const minFormatted = formatCurrency(minimum, currency, options);
  const maxFormatted = formatCurrency(maximum, currency, options);
  return `${minFormatted}${rangeSeparator}${maxFormatted}`;
}

export function formatCompactCurrency(
  amount: number,
  currency: SupportedCurrency,
  options?: FormatOptions
): string {
  const metadata = CURRENCY_METADATA[currency];
  const locale = options?.locale || metadata.locale;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(amount);
}

/**
 * Date formatting utilities
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

export function formatDateTime(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(dateObj);
}

export function formatRelativeTime(
  date: Date | string | number,
  options?: Intl.RelativeTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto', ...options });
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
  } else if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
  }
}

/**
 * Number formatting utilities
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('ru-RU', options).format(value);
}

export function formatPercent(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'percent',
    ...options,
  }).format(value);
}