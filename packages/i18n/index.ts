export type Locale = "ru" | "uz";

type Dictionary = Record<string, string>;

export const dict: Record<Locale, Dictionary> = {
  ru: {
    welcome: "Добро пожаловать",
    vendors: "Поставщики",
    venues: "Тойханы",
    enquire: "Отправить заявку",
  },
  uz: {
    welcome: "Xush kelibsiz",
    vendors: "Ta'minotchilar",
    venues: "To'yxonalar",
    enquire: "So'rov yuborish",
  },
};

export function t(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? key;
}
