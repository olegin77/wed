import {
  SUPPORTED_CURRENCIES as supportedCurrenciesImpl,
  currencyMetadata as currencyMetadataImpl,
  formatCurrency as formatCurrencyImpl,
  formatCurrencyRange as formatCurrencyRangeImpl,
  formatCompactCurrency as formatCompactCurrencyImpl,
} from "./index.js";

/**
 * Supported marketplace currencies. Each currency is backed by metadata that
 * describes its canonical locale and precision.
 */
export type SupportedCurrency = "UZS" | "RUB" | "KZT";

/**
 * Additional options recognised by the formatting helpers. The structure extends
 * the built-in `Intl.NumberFormatOptions` with our own `locale` override and a
 * `rangeSeparator` for `formatCurrencyRange`.
 */
export interface FormatOptions
  extends Omit<Intl.NumberFormatOptions, "style" | "currency"> {
  /** Optional locale override; defaults to the currency-specific locale. */
  locale?: string;

  /** Separator used by {@link formatCurrencyRange} between min and max values. */
  rangeSeparator?: string;
}

export const SUPPORTED_CURRENCIES =
  supportedCurrenciesImpl as readonly SupportedCurrency[];

export const currencyMetadata = currencyMetadataImpl as Record<
  SupportedCurrency,
  {
    /** Locale used by default when formatting the currency. */
    locale: string;
    /** Minimum number of fractional digits shown. */
    minimumFractionDigits: number;
    /** Maximum number of fractional digits shown. */
    maximumFractionDigits: number;
  }
>;

/**
 * Formats a numeric value using the defaults of the selected currency.
 */
export const formatCurrency = formatCurrencyImpl as (
  amount: number,
  currency: SupportedCurrency,
  options?: FormatOptions
) => string;

/**
 * Formats a range of monetary values with a consistent separator.
 */
export const formatCurrencyRange = formatCurrencyRangeImpl as (
  minimum: number,
  maximum: number,
  currency: SupportedCurrency,
  options?: FormatOptions
) => string;

/**
 * Formats a numeric value in compact notation (e.g. marketing dashboards).
 */
export const formatCompactCurrency = formatCompactCurrencyImpl as (
  amount: number,
  currency: SupportedCurrency,
  options?: FormatOptions
) => string;
