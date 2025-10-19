import type {
  BudgetRecommendation,
  BudgetTier,
  GuestSegment,
  LocaleText,
} from "../../../../packages/catalog/budget";

/**
 * Finite set of supported bundle component kinds used by hall+decor+music packages.
 */
export type BundleComponentKind = "venue" | "decor" | "music";

/**
 * Defines the proportional budget allocation range for a bundle component.
 */
export type BundleShareRange = {
  min: number;
  max: number;
};

/**
 * Describes a single component (venue, decor or music) that forms a bundle.
 */
export interface BundleComponentDefinition {
  slug: string;
  kind: BundleComponentKind;
  label: LocaleText;
  description: LocaleText;
  categories: string[];
  share: BundleShareRange;
  floor?: number;
  deliverables: LocaleText[];
}

/**
 * Schema for curated presets that combine the three components into a ready-to-sell bundle.
 */
export interface BundlePresetDefinition {
  slug: string;
  label: LocaleText;
  description: LocaleText;
  recommendedTier: BudgetTier["slug"];
  targetSegment: GuestSegment["slug"];
  inclusions: LocaleText[];
  components: BundleComponentDefinition[];
  note?: LocaleText;
}

/**
 * Input payload for computing a price breakdown for a given bundle preset.
 */
export interface BundleQuoteInput {
  presetSlug: string;
  guests: number;
  city?: string;
  tier?: BudgetTier["slug"];
}

/**
 * Output shape for a single component cost estimation inside a bundle quote.
 */
export interface BundleComponentQuote {
  definition: BundleComponentDefinition;
  price: {
    currency: BudgetRecommendation["currency"];
    min: number;
    max: number;
    share: BundleShareRange;
  };
}

/**
 * Full response containing the preset metadata and per-component quote.
 */
export interface BundleQuote {
  preset: BundlePresetDefinition;
  total: BudgetRecommendation;
  components: BundleComponentQuote[];
}
