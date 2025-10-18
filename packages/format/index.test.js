import assert from "node:assert/strict";
import { test } from "node:test";

import {
  SUPPORTED_CURRENCIES,
  currencyMetadata,
  formatCompactCurrency,
  formatCurrency,
  formatCurrencyRange,
} from "./index.js";

test("exposes supported currencies and metadata", () => {
  assert.deepEqual(SUPPORTED_CURRENCIES, ["UZS", "RUB", "KZT"]);
  for (const code of SUPPORTED_CURRENCIES) {
    const meta = currencyMetadata[code];
    assert.equal(typeof meta.locale, "string");
    assert.ok(meta.locale.length > 0);
    assert.equal(typeof meta.minimumFractionDigits, "number");
    assert.equal(typeof meta.maximumFractionDigits, "number");
    assert.ok(meta.maximumFractionDigits >= meta.minimumFractionDigits);
  }
});

test("formats Uzbekistani som without fractional digits by default", () => {
  const amount = 1250000;
  const formatted = formatCurrency(amount, "UZS");
  const expected = new Intl.NumberFormat("ru-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  assert.equal(formatted, expected);
});

test("supports locale overrides and fractional precision", () => {
  const formatted = formatCurrency(199.9, "RUB", {
    locale: "en-GB",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  assert.equal(formatted, "RUB 199.9");
});

test("throws when the amount is invalid or the currency is unsupported", () => {
  assert.throws(() => formatCurrency(Number.NaN, "UZS"), /format\.invalid_amount/);
  assert.throws(() => formatCurrency(10, "USD"), /format\.unsupported_currency/);
});

test("formats currency ranges with custom separators", () => {
  const formatted = formatCurrencyRange(1000000, 2500000, "UZS", {
    rangeSeparator: " до ",
  });

  assert.match(formatted, /^\d+[\s\u00A0]?\d*[\s\u00A0]?\d*\sUZS до \d+[\s\u00A0]?\d*[\s\u00A0]?\d*\sUZS$/);
});

test("compacts large numbers for marketing copy", () => {
  const formatted = formatCompactCurrency(12000, "RUB");
  assert.match(formatted, /тыс\./);
});

test("rejects inverted ranges", () => {
  assert.throws(
    () => formatCurrencyRange(500, 100, "KZT"),
    /format\.invalid_range/
  );
});
