import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export type Locale = "ru" | "uz" | "kk" | "kg" | "az";

type Dictionary = Record<string, string>;

const ruBase = require("./ru.json") as Dictionary;
const uzBase = require("./uz.json") as Dictionary;
const kkBase = require("./kk.json") as Dictionary;
const kgBase = require("./kg.json") as Dictionary;
const azBase = require("./az.json") as Dictionary;

/**
 * Locale dictionaries exposed by the lightweight i18n helper.
 */
export const dict: Record<Locale, Dictionary> = {
  ru: {
    ...ruBase,
    welcome: "Добро пожаловать",
    vendors: "Поставщики",
    venues: "Тойханы",
    enquire: "Отправить заявку",
  },
  uz: {
    ...uzBase,
    welcome: "Xush kelibsiz",
    vendors: "Ta'minotchilar",
    venues: "To'yxonalar",
    enquire: "So'rov yuborish",
  },
  kk: {
    ...kkBase,
  },
  kg: {
    ...kgBase,
  },
  az: {
    ...azBase,
  },
};

/**
 * Returns a translated string for the provided key, defaulting to the key when
 * the locale does not expose the requested entry.
 */
export function t(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? key;
}
