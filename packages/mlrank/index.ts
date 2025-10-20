/**
 * Входные факторы для оффлайн-скоринга каталога.
 *
 * Все значения ожидаются в диапазоне `[0, 1]` и обычно поступают из
 * нормализованных аналитических витрин. Поле `price` опционально и может быть
 * использовано для штрафов/бонусов за ценовой сигнал.
 */
export interface OfflineScoreInput {
  conv: number;
  rating: number;
  profile: number;
  calendar: number;
  price?: number;
}

/** Весовые коэффициенты для оффлайн-скорера. */
export interface OfflineScoreWeights {
  conv: number;
  rating: number;
  profile: number;
  calendar: number;
  price: number;
}

const DEFAULT_WEIGHTS: OfflineScoreWeights = {
  conv: 0.55,
  rating: 0.2,
  profile: 0.2,
  calendar: 0.05,
  price: 0,
};

/**
 * Ограничивает значение в диапазоне `[0, 1]`, чтобы сохранить совместимость с
 * downstream-фильтрами, ожидающими нормализованный скор.
 */
export function clampNormalized(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

/**
 * Простейшая линейная модель под оффлайн-скоры (заменяется на ML позднее).
 *
 * Позволяет при необходимости переопределить весовые коэффициенты, чтобы в
 * разных экспериментах/региональных витринах оперативно изменять влияние
 * факторов без пересборки пакета.
 */
export function score(
  factors: OfflineScoreInput,
  weightsOverride: Partial<OfflineScoreWeights> = {},
): number {
  const weights: OfflineScoreWeights = {
    ...DEFAULT_WEIGHTS,
    ...weightsOverride,
  };

  const weightedSum =
    weights.conv * factors.conv +
    weights.rating * factors.rating +
    weights.profile * factors.profile +
    weights.calendar * factors.calendar +
    weights.price * (factors.price ?? 0);

  return clampNormalized(weightedSum);
}

/** Возвращает весовые коэффициенты по умолчанию (без возможности мутации). */
export function getDefaultWeights(): OfflineScoreWeights {
  return { ...DEFAULT_WEIGHTS };
}
