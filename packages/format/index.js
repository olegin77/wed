/**
 * Currency formatting utilities tailored to marketplaces that operate across
 * Uzbekistan, Russia, and Kazakhstan. The helpers enforce consistent defaults
 * while still exposing the full power of `Intl.NumberFormat` for edge cases
 * such as marketing copy or analytics exports.
 */

const DEFAULT_INTL_OPTIONS = Object.freeze({
  currencyDisplay: "symbol",
  useGrouping: true,
  trailingZeroDisplay: "stripIfInteger",
});

/**
 * Metadata describing the default locale and precision for each supported
 * currency. The configuration mirrors the way amounts are presented in
 * customer-facing flows of the product.
 */
export const currencyMetadata = Object.freeze({
  UZS: Object.freeze({
    locale: "ru-UZ",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  RUB: Object.freeze({
    locale: "ru-RU",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  KZT: Object.freeze({
    locale: "ru-KZ",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
});

/** @type {readonly [keyof typeof currencyMetadata, ...(keyof typeof currencyMetadata)[]]} */
export const SUPPORTED_CURRENCIES = Object.freeze(Object.keys(currencyMetadata));

const RANGE_SEPARATOR = " – ";

function assertSupportedCurrency(currency) {
  if (!Object.hasOwn(currencyMetadata, currency)) {
    throw new RangeError(`format.unsupported_currency:${currency}`);
  }
}

function assertFiniteNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`format.invalid_${label}`);
  }
}

function resolveIntlConfiguration(currency, rawOptions = {}) {
  const meta = currencyMetadata[currency];
  const {
    locale: customLocale,
    rangeSeparator,
    minimumFractionDigits: requestedMin,
    maximumFractionDigits: requestedMax,
    ...intlOverrides
  } = rawOptions;

  const locale = customLocale ?? meta.locale;
  const minimumFractionDigits =
    requestedMin !== undefined ? requestedMin : meta.minimumFractionDigits;
  const fallbackMax = requestedMax ?? meta.maximumFractionDigits;
  const maximumFractionDigits = Math.max(
    fallbackMax ?? minimumFractionDigits,
    minimumFractionDigits
  );

  return {
    locale,
    rangeSeparator,
    intlOptions: {
      ...DEFAULT_INTL_OPTIONS,
      ...intlOverrides,
      minimumFractionDigits,
      maximumFractionDigits,
      style: "currency",
      currency,
    },
  };
}

/**
 * Formats a numeric value using the defaults of the provided currency.
 *
 * @param {number} amount - Monetary value that should be formatted.
 * @param {keyof typeof currencyMetadata} currency - ISO 4217 currency code.
 * @param {Intl.NumberFormatOptions & { locale?: string }} [options] - Optional
 *   overrides forwarded to `Intl.NumberFormat`. The `style` and `currency`
 *   options are enforced by the helper.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(amount, currency, options = {}) {
  assertSupportedCurrency(currency);
  assertFiniteNumber(amount, "amount");

  const { locale, intlOptions } = resolveIntlConfiguration(currency, options);
  return new Intl.NumberFormat(locale, intlOptions).format(amount);
}

/**
 * Formats a price range using consistent separators. Equal boundary values fall
 * back to the plain formatter for cleaner output.
 *
 * @param {number} minimum - Lower bound of the price range.
 * @param {number} maximum - Upper bound of the price range.
 * @param {keyof typeof currencyMetadata} currency - ISO 4217 currency code.
 * @param {(Intl.NumberFormatOptions & { locale?: string; rangeSeparator?: string })} [options]
 *   Overrides that are passed to the single-value formatter. Use
 *   `rangeSeparator` to customise the separator between the min and max values.
 * @returns {string} Formatted price range string.
 */
export function formatCurrencyRange(minimum, maximum, currency, options = {}) {
  assertSupportedCurrency(currency);
  assertFiniteNumber(minimum, "minimum");
  assertFiniteNumber(maximum, "maximum");
  if (minimum > maximum) {
    throw new RangeError("format.invalid_range");
  }

  const { rangeSeparator = RANGE_SEPARATOR, ...formatOptions } = options;
  if (minimum === maximum) {
    return formatCurrency(maximum, currency, formatOptions);
  }

  return `${formatCurrency(minimum, currency, formatOptions)}${rangeSeparator}${formatCurrency(
    maximum,
    currency,
    formatOptions
  )}`;
}

/**
 * Produces compact currency strings (e.g. "12,0 тыс. ₽") intended for
 * dashboards and marketing banners.
 *
 * @param {number} amount - Monetary value to format using compact notation.
 * @param {keyof typeof currencyMetadata} currency - Currency code supported by
 *   the helper.
 * @param {Intl.NumberFormatOptions & { locale?: string }} [options] - Optional
 *   overrides passed to the base formatter.
 * @returns {string} Compact representation of the value with currency symbol.
 */
export function formatCompactCurrency(amount, currency, options = {}) {
  assertSupportedCurrency(currency);

  const compactOptions = {
    ...options,
    notation: "compact",
    maximumFractionDigits:
      options.maximumFractionDigits ??
      Math.max(1, currencyMetadata[currency].minimumFractionDigits),
  };

  return formatCurrency(amount, currency, compactOptions);
}
