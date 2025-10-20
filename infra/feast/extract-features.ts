import { clampNormalized, type OfflineScoreInput } from "@wt/mlrank";

const MAX_PERCENT = 100;
const MAX_PROFILE_SCORE = 100;
const MAX_RATING = 5;
const STALE_WINDOW_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Снимок агрегированных метрик, из которых извлекаются признаки каталога.
 *
 * Структура допускает как плоские поля (например, `rating`) из старых
 * интеграций, так и вложенные структуры (`analytics.conversionRate`) из новых
 * пайплайнов. Неиспользуемые значения игнорируются без ошибок, что позволяет
 * безопасно вызывать экстрактор на частично заполненных объектах.
 */
export interface CatalogFeatureSource {
  readonly conv?: number | null;
  readonly conversionRate?: number | null;
  readonly enquiryConversionRate?: number | null;
  readonly analytics?: {
    readonly conversionRate?: number | null;
    readonly conversion30d?: number | null;
    readonly priceSignal?: number | null;
  } | null;
  readonly metrics?: {
    readonly conversionRate?: number | null;
    readonly ratingAverage?: number | null;
    readonly profileCompleteness?: number | null;
    readonly calendarAvailability?: number | null;
  } | null;
  readonly rating?: number | null;
  readonly ratingAverage?: number | null;
  readonly reviewAverage?: number | null;
  readonly reviews?: {
    readonly average?: number | null;
    readonly count?: number | null;
  } | null;
  readonly profileScore?: number | null;
  readonly profileCompleteness?: number | null;
  readonly profile?: {
    readonly score?: number | null;
    readonly completeness?: number | null;
  } | null;
  readonly calendar?: {
    readonly availabilityRatio?: number | null;
    readonly futureAvailabilityRatio?: number | null;
    readonly coverageRatio?: number | null;
    readonly staleDays?: number | null;
    readonly freshnessDays?: number | null;
    readonly updatedAt?: string | Date | null;
  } | null;
  readonly calendarAvailability?: number | null;
  readonly calendarCoverage?: number | null;
  readonly calendarFreshnessDays?: number | null;
  readonly calendarUpdatedAt?: string | Date | null;
  readonly priceSignal?: number | null;
  readonly priceScore?: number | null;
  readonly pricing?: {
    readonly relativeScore?: number | null;
  } | null;
  readonly [key: string]: unknown;
}

function toNumber(candidate: unknown): number | null {
  if (typeof candidate === "number" && Number.isFinite(candidate)) {
    return candidate;
  }
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeRatioCandidate(
  candidate: unknown,
  allowPercent: boolean,
): number | undefined {
  const numeric = toNumber(candidate);
  if (numeric === null) {
    return undefined;
  }

  if (!Number.isFinite(numeric)) {
    return undefined;
  }

  if (allowPercent && numeric > 1) {
    if (numeric <= MAX_PERCENT) {
      return clampNormalized(numeric / MAX_PERCENT);
    }
    return 1;
  }

  if (numeric < 0) {
    return 0;
  }

  if (numeric > 1) {
    return 1;
  }

  return numeric;
}

function pickNormalizedRatio(
  candidates: unknown[],
  options: { allowPercent?: boolean } = {},
): number | undefined {
  const allowPercent = options.allowPercent ?? true;
  for (const candidate of candidates) {
    const normalized = normalizeRatioCandidate(candidate, allowPercent);
    if (normalized !== undefined) {
      return normalized;
    }
  }
  return undefined;
}

function normalizeRatingCandidate(candidate: unknown): number | undefined {
  const numeric = toNumber(candidate);
  if (numeric === null) {
    return undefined;
  }

  if (!Number.isFinite(numeric)) {
    return undefined;
  }

  if (numeric <= 1) {
    return clampNormalized(numeric);
  }

  if (numeric <= MAX_RATING) {
    return clampNormalized(numeric / MAX_RATING);
  }

  if (numeric <= MAX_PERCENT) {
    return clampNormalized(numeric / MAX_PERCENT);
  }

  return 1;
}

function pickNormalizedRating(candidates: unknown[]): number | undefined {
  for (const candidate of candidates) {
    const normalized = normalizeRatingCandidate(candidate);
    if (normalized !== undefined) {
      return normalized;
    }
  }
  return undefined;
}

function normalizeProfileCandidate(candidate: unknown): number | undefined {
  const numeric = toNumber(candidate);
  if (numeric === null) {
    return undefined;
  }

  if (!Number.isFinite(numeric)) {
    return undefined;
  }

  if (numeric <= 1) {
    return clampNormalized(numeric);
  }

  if (numeric <= MAX_PROFILE_SCORE) {
    return clampNormalized(numeric / MAX_PROFILE_SCORE);
  }

  return 1;
}

function pickNormalizedProfile(candidates: unknown[]): number | undefined {
  for (const candidate of candidates) {
    const normalized = normalizeProfileCandidate(candidate);
    if (normalized !== undefined) {
      return normalized;
    }
  }
  return undefined;
}

function parseDateCandidate(candidate: unknown): Date | undefined {
  if (candidate instanceof Date && !Number.isNaN(candidate.getTime())) {
    return candidate;
  }
  if (typeof candidate === "string" && candidate.trim().length > 0) {
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return undefined;
}

function pickCalendarStalenessDays(source: CatalogFeatureSource): number | undefined {
  const direct = pickNumber([
    source.calendar?.staleDays,
    source.calendar?.freshnessDays,
    source.calendarFreshnessDays,
  ]);
  if (direct !== undefined) {
    return Math.max(0, direct);
  }

  const updatedAt = pickDate([
    source.calendar?.updatedAt,
    source.calendarUpdatedAt,
  ]);
  if (!updatedAt) {
    return undefined;
  }

  const diffMs = Date.now() - updatedAt.getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) {
    return undefined;
  }
  return diffMs / DAY_MS;
}

function pickNumber(candidates: unknown[]): number | undefined {
  for (const candidate of candidates) {
    const numeric = toNumber(candidate);
    if (numeric !== null) {
      return numeric;
    }
  }
  return undefined;
}

function pickDate(candidates: unknown[]): Date | undefined {
  for (const candidate of candidates) {
    const parsed = parseDateCandidate(candidate);
    if (parsed) {
      return parsed;
    }
  }
  return undefined;
}

function normalizeRecency(staleDays: number | undefined): number | undefined {
  if (staleDays === undefined) {
    return undefined;
  }

  if (!Number.isFinite(staleDays)) {
    return undefined;
  }

  if (staleDays <= 0) {
    return 1;
  }

  if (staleDays >= STALE_WINDOW_DAYS) {
    return 0;
  }

  return clampNormalized(1 - staleDays / STALE_WINDOW_DAYS);
}

function computeCalendarScore(source: CatalogFeatureSource): number {
  const availability =
    pickNormalizedRatio(
      [
        source.calendar?.availabilityRatio,
        source.calendar?.futureAvailabilityRatio,
        source.calendar?.coverageRatio,
        source.metrics?.calendarAvailability,
        source.calendarAvailability,
        source.calendarCoverage,
      ].filter((candidate) => candidate !== undefined),
    ) ?? 0;

  const recency = normalizeRecency(pickCalendarStalenessDays(source));

  if (recency === undefined) {
    return clampNormalized(availability);
  }

  if (availability === 0) {
    return clampNormalized(recency * 0.6);
  }

  return clampNormalized(availability * 0.7 + recency * 0.3);
}

/**
 * Извлекает нормализованные факторы для оффлайн-скоринга каталога.
 */
export function extract(source: CatalogFeatureSource): OfflineScoreInput {
  const conv =
    pickNormalizedRatio(
      [
        source.analytics?.conversion30d,
        source.analytics?.conversionRate,
        source.metrics?.conversionRate,
        source.enquiryConversionRate,
        source.conversionRate,
        source.conv,
      ],
    ) ?? 0;

  const rating =
    pickNormalizedRating([
      source.reviews?.average,
      source.reviewAverage,
      source.metrics?.ratingAverage,
      source.ratingAverage,
      source.rating,
    ]) ?? 0;

  const profile =
    pickNormalizedProfile([
      source.profile?.completeness,
      source.profile?.score,
      source.profileCompleteness,
      source.metrics?.profileCompleteness,
      source.profileScore,
    ]) ?? 0;

  const calendar = computeCalendarScore(source);

  const result: OfflineScoreInput = {
    conv,
    rating,
    profile,
    calendar,
  };

  const priceSignal = pickNormalizedRatio(
    [
      source.pricing?.relativeScore,
      source.analytics?.priceSignal,
      source.priceSignal,
      source.priceScore,
    ],
  );

  if (priceSignal !== undefined) {
    result.price = priceSignal;
  }

  return result;
}
