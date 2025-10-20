export type LocaleText = {
  ru: string;
  uz: string;
  en: string;
};

export type GuestSegment = {
  slug: "micro" | "intimate" | "standard" | "grand" | "ultra" | "mega";
  range: { min: number; max: number | null };
  label: LocaleText;
  description: LocaleText;
};

export type BudgetTier = {
  slug: "lean" | "balanced" | "premium" | "luxury";
  label: LocaleText;
  description: LocaleText;
  perGuest: number;
  baseRange: { min: number; max: number };
};

export const guestSegments: GuestSegment[] = [
  {
    slug: "micro",
    range: { min: 0, max: 40 },
    label: {
      ru: "До 40 гостей",
      uz: "40 tagacha mehmon",
      en: "Up to 40 guests",
    },
    description: {
      ru: "Ужин для самых близких, камерные форматы и city hall.",
      uz: "Eng yaqinlar uchun kechki ovqat va kam sonli marosim.",
      en: "Intimate dinners, city hall ceremonies and microweddings.",
    },
  },
  {
    slug: "intimate",
    range: { min: 41, max: 90 },
    label: {
      ru: "41–90 гостей",
      uz: "41–90 mehmon",
      en: "41–90 guests",
    },
    description: {
      ru: "Стандартный банкет с ближним кругом и друзьями.",
      uz: "Oila a'zolari va eng yaqin do'stlar uchun an'anaviy to'y.",
      en: "Core family banquet with closest friends.",
    },
  },
  {
    slug: "standard",
    range: { min: 91, max: 180 },
    label: {
      ru: "91–180 гостей",
      uz: "91–180 mehmon",
      en: "91–180 guests",
    },
    description: {
      ru: "Популярный формат с полноценной шоу-программой.",
      uz: "To'liq shou dasturi bilan mashhur format.",
      en: "Popular format with full entertainment programme.",
    },
  },
  {
    slug: "grand",
    range: { min: 181, max: 300 },
    label: {
      ru: "181–300 гостей",
      uz: "181–300 mehmon",
      en: "181–300 guests",
    },
    description: {
      ru: "Большой банкет, несколько зон и зонирование.",
      uz: "Katta bazm, bir nechta zonalar va dizayn yechimlari.",
      en: "Large celebration with zoning and multiple areas.",
    },
  },
  {
    slug: "ultra",
    range: { min: 301, max: 500 },
    label: {
      ru: "301–500 гостей",
      uz: "301–500 mehmon",
      en: "301–500 guests",
    },
    description: {
      ru: "Большая семья и расширенный список гостей.",
      uz: "Kengaytirilgan mehmonlar ro'yxati bilan katta to'y.",
      en: "Extended guest lists and multi-day celebrations.",
    },
  },
  {
    slug: "mega",
    range: { min: 501, max: null },
    label: {
      ru: "500+ гостей",
      uz: "500+ mehmon",
      en: "500+ guests",
    },
    description: {
      ru: "Формат national wedding с тысячей гостей и больше.",
      uz: "Katta toyxona va minglab mehmonlar bilan milliy format.",
      en: "Grand national-style weddings with hundreds of attendees.",
    },
  },
];

const UZS_MILLION = 1_000_000;

export const budgetTiers: BudgetTier[] = [
  {
    slug: "lean",
    label: {
      ru: "Базовый",
      uz: "Bazaviy",
      en: "Lean",
    },
    description: {
      ru: "Рациональный бюджет с фокусом на ключевых подрядчиков.",
      uz: "Asosiy xizmatlarga yo'naltirilgan tejamkor byudjet.",
      en: "Lean spend prioritising core vendors.",
    },
    perGuest: 550_000,
    baseRange: { min: 35 * UZS_MILLION, max: 70 * UZS_MILLION },
  },
  {
    slug: "balanced",
    label: {
      ru: "Оптимальный",
      uz: "Optimal",
      en: "Balanced",
    },
    description: {
      ru: "Комфортный баланс качества, декора и программы.",
      uz: "Sifat, dekor va dastur o'rtasida muvozanat.",
      en: "Balanced choice of decor, experience and service.",
    },
    perGuest: 750_000,
    baseRange: { min: 60 * UZS_MILLION, max: 120 * UZS_MILLION },
  },
  {
    slug: "premium",
    label: {
      ru: "Премиум",
      uz: "Premium",
      en: "Premium",
    },
    description: {
      ru: "Авторские концепции, индивидуальный декор и расширенная команда.",
      uz: "Mualliflik konsepsiyasi va kengaytirilgan jamoa.",
      en: "Bespoke concepts with extended vendor teams.",
    },
    perGuest: 1_050_000,
    baseRange: { min: 110 * UZS_MILLION, max: 220 * UZS_MILLION },
  },
  {
    slug: "luxury",
    label: {
      ru: "Люкс",
      uz: "Lyuks",
      en: "Luxury",
    },
    description: {
      ru: "Уникальные площадки, top-декор и сложные постановки.",
      uz: "Noyob maydonlar, yuqori darajadagi dekor va murakkab sahna.",
      en: "High-end venues, bespoke decor and production-heavy shows.",
    },
    perGuest: 1_550_000,
    baseRange: { min: 200 * UZS_MILLION, max: 420 * UZS_MILLION },
  },
];

const CITY_MULTIPLIERS: Record<string, number> = {
  tashkent: 1.15,
  samarkand: 1.05,
  bukhara: 1.0,
  fergana: 0.95,
  namangan: 0.93,
  nukus: 0.9,
};

export type BudgetRecommendationInput = {
  guests: number;
  tier?: BudgetTier["slug"];
  city?: string;
};

export type BudgetRecommendation = {
  currency: "UZS";
  min: number;
  max: number;
  perGuest: number;
  tier: BudgetTier;
  guestSegment: GuestSegment;
  multiplier: number;
};

export function resolveGuestSegment(guestCount: number): GuestSegment {
  const normalized = Math.max(guestCount, 0);
  for (const segment of guestSegments) {
    const { min, max } = segment.range;
    if (max === null && normalized >= min) {
      return segment;
    }
    if (normalized >= min && normalized <= (max ?? Number.POSITIVE_INFINITY)) {
      return segment;
    }
  }
  return guestSegments[0];
}

export function getBudgetTier(slug: BudgetTier["slug"]): BudgetTier {
  const tier = budgetTiers.find((candidate) => candidate.slug === slug);
  if (!tier) {
    return budgetTiers[1];
  }
  return tier;
}

export function recommendBudget(input: BudgetRecommendationInput): BudgetRecommendation {
  const tier = getBudgetTier(input.tier ?? "balanced");
  const segment = resolveGuestSegment(input.guests);
  const guests = Math.max(input.guests, 1);
  const multiplier = CITY_MULTIPLIERS[input.city?.toLowerCase() ?? ""] ?? 1;
  const baselineMin = tier.baseRange.min;
  const baselineMax = tier.baseRange.max;
  const scaledMin = Math.round((baselineMin + tier.perGuest * Math.max(segment.range.min, 1)) * multiplier);
  const scaledMax = Math.round((baselineMax + tier.perGuest * guests) * multiplier);

  return {
    currency: "UZS",
    min: scaledMin,
    max: scaledMax,
    perGuest: Math.round(tier.perGuest * multiplier),
    tier,
    guestSegment: segment,
    multiplier,
  };
}

export const budgetPresets = budgetTiers;
export const guestsPresets = guestSegments;
