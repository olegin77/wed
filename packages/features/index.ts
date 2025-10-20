import { clampNormalized, type OfflineScoreInput } from "@wt/mlrank";

export type VendorFeatures = OfflineScoreInput;

export type FeatureNamespace = keyof typeof registry;

export type FeatureKey<TNamespace extends FeatureNamespace> =
  (typeof registry)[TNamespace][number];

export const registry = {
  VendorFeatures: ["conv", "rating", "profile", "calendar", "price"] as const,
};

/**
 * Normalises и заполняет вектор признаков поставщика. Все значения приводятся к
 * диапазону `[0, 1]`, а отсутствующие поля получают значение `0`.
 */
export function normaliseVendorFeatures(candidate: Partial<VendorFeatures>): VendorFeatures {
  return {
    conv: clampNormalized(candidate.conv ?? 0),
    rating: clampNormalized(candidate.rating ?? 0),
    profile: clampNormalized(candidate.profile ?? 0),
    calendar: clampNormalized(candidate.calendar ?? 0),
    price:
      candidate.price === undefined ? undefined : clampNormalized(candidate.price),
  };
}

/**
 * Представляет вектор признаков в виде массива чисел для передачи в модели,
 * ожидающие фиксированный порядок значений.
 */
export function toArray(features: VendorFeatures): number[] {
  return [
    clampNormalized(features.conv),
    clampNormalized(features.rating),
    clampNormalized(features.profile),
    clampNormalized(features.calendar),
    clampNormalized(features.price ?? 0),
  ];
}
