import { recommendBudget } from "../../../../packages/catalog/budget";
import { bundlePresets } from "./presets";
import type {
  BundleComponentDefinition,
  BundleComponentQuote,
  BundlePresetDefinition,
  BundleQuote,
  BundleQuoteInput,
  BundleShareRange,
} from "./types";

const PRESET_LOOKUP = new Map(bundlePresets.map((preset) => [preset.slug, preset]));

function normalizeShareRange(share: BundleShareRange): BundleShareRange {
  const min = Math.max(0, Math.min(share.min, 1));
  const max = Math.max(min, Math.min(share.max, 1));
  return { min, max };
}

function calculateComponentQuote(
  total: BundleQuote["total"],
  component: BundleComponentDefinition
): BundleComponentQuote {
  const share = normalizeShareRange(component.share);
  const minPortion = Math.round(total.min * share.min);
  const maxPortion = Math.round(total.max * share.max);
  const floor = component.floor ?? 0;
  const min = Math.max(minPortion, floor);
  const max = Math.max(maxPortion, min);

  return {
    definition: component,
    price: {
      currency: total.currency,
      min,
      max,
      share,
    },
  };
}

/**
 * Returns all curated bundle presets ordered by priority.
 */
export function listBundlePresets(): readonly BundlePresetDefinition[] {
  return bundlePresets;
}

/**
 * Resolves a preset by slug and throws if the preset is not defined.
 */
export function getBundlePreset(slug: string): BundlePresetDefinition {
  const preset = PRESET_LOOKUP.get(slug);
  if (!preset) {
    throw new Error(`Unknown bundle preset: ${slug}`);
  }
  return preset;
}

/**
 * Produces a price quote with per-component allocations for a chosen preset.
 */
export function estimateBundleQuote(input: BundleQuoteInput): BundleQuote {
  const guests = Number.isFinite(input.guests) ? Math.max(1, Math.round(input.guests)) : 1;
  const preset = getBundlePreset(input.presetSlug);
  const total = recommendBudget({
    guests,
    tier: input.tier ?? preset.recommendedTier,
    city: input.city,
  });

  const components = preset.components.map((component) =>
    calculateComponentQuote(total, component)
  );

  return { preset, total, components };
}

export { bundlePresets };
