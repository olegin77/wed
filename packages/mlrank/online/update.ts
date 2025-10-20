/** Возможные ключи весов для онлайн-скоринга. */
type WeightKey = "conv" | "rating" | "profile" | "calendar";

/** Текущее состояние весовых коэффициентов. */
export type WeightVector = Record<WeightKey, number>;

/**
 * Событие, влияющее на онлайн-обновление весов.
 *
 * `delta` по умолчанию равна `1` и отражает вклад события (например, вес клика).
 */
export interface OnlineWeightEvent {
  type: "click" | "book";
  delta?: number;
  timestamp?: Date;
}

/** Параметры обновления (дополнительное сглаживание и ограничения). */
export interface OnlineUpdateOptions {
  /**
   * Насколько быстро веса «стягиваются» к дефолтным значениям перед обработкой
   * события. Диапазон 0..1. Значение 0 — без затухания.
   */
  decay?: number;
  /** Минимальная доля одного фактора после нормализации. */
  floor?: number;
  /** Максимальная доля одного фактора после нормализации. */
  ceiling?: number;
}

const DEFAULT_WEIGHTS: WeightVector = {
  conv: 0.55,
  rating: 0.2,
  profile: 0.2,
  calendar: 0.05,
};

const DEFAULT_LEARNING_RATES: Record<OnlineWeightEvent["type"], WeightVector> = {
  click: {
    conv: 0.0005,
    rating: 0.0002,
    profile: 0,
    calendar: 0,
  },
  book: {
    conv: 0.001,
    rating: 0,
    profile: 0.0005,
    calendar: 0.0003,
  },
};

const DEFAULT_UPDATE_OPTIONS: Required<OnlineUpdateOptions> = {
  decay: 0.002,
  floor: 0.01,
  ceiling: 0.8,
};

const state: {
  weights: WeightVector;
  totalUpdates: number;
  lastUpdatedAt: Date | null;
} = {
  weights: { ...DEFAULT_WEIGHTS },
  totalUpdates: 0,
  lastUpdatedAt: null,
};

const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value));

function applyDecay(decay: number): void {
  if (decay <= 0) {
    return;
  }
  (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
    const current = state.weights[key];
    const target = DEFAULT_WEIGHTS[key];
    state.weights[key] = current * (1 - decay) + target * decay;
  });
}

function applyEventDelta(event: OnlineWeightEvent): void {
  const learningRate = DEFAULT_LEARNING_RATES[event.type];
  const magnitude = event.delta ?? 1;

  (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
    const adjustment = learningRate[key] * magnitude;
    if (adjustment === 0) {
      return;
    }
    state.weights[key] = clamp(state.weights[key] + adjustment, 0, 1);
  });
}

function normaliseWeights(floor: number, ceiling: number): void {
  (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
    state.weights[key] = clamp(state.weights[key], 0, 1);
  });

  let sum = (Object.values(state.weights) as number[]).reduce((acc, value) => acc + value, 0);
  if (sum <= 0) {
    (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
      state.weights[key] = DEFAULT_WEIGHTS[key];
    });
    return;
  }

  (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
    state.weights[key] = state.weights[key] / sum;
  });

  if (floor <= 0 && ceiling >= 1) {
    return;
  }

  (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
    state.weights[key] = clamp(state.weights[key], floor, ceiling);
  });

  sum = (Object.values(state.weights) as number[]).reduce((acc, value) => acc + value, 0);
  if (sum <= 0) {
    (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
      state.weights[key] = DEFAULT_WEIGHTS[key];
    });
    return;
  }

  (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
    state.weights[key] = state.weights[key] / sum;
  });
}

/**
 * Обновляет веса онлайн-скоринга на основе одного события (клик/бронирование).
 *
 * Возвращает копию нового вектора весов — состояние заморожено для внешнего
 * потребителя и не требует глубокой копии на его стороне.
 */
export function update(
  event: OnlineWeightEvent,
  options: OnlineUpdateOptions = {},
): WeightVector {
  const { decay, floor, ceiling } = {
    ...DEFAULT_UPDATE_OPTIONS,
    ...options,
  };

  if (floor < 0 || floor > ceiling) {
    throw new Error("Floor must be non-negative and not exceed the ceiling");
  }

  if (!DEFAULT_LEARNING_RATES[event.type]) {
    throw new Error(`Unsupported event type: ${event.type}`);
  }

  applyDecay(decay);
  applyEventDelta(event);
  normaliseWeights(floor, ceiling);

  state.totalUpdates += 1;
  state.lastUpdatedAt = event.timestamp ?? new Date();

  return getWeights();
}

/** Возвращает копию текущего вектора весов. */
export function getWeights(): WeightVector {
  return { ...state.weights };
}

/**
 * Сбрасывает веса к значениям по умолчанию.
 * Полезно при запуске экспериментов или ошибочных апдейтах.
 */
export function resetWeights(): void {
  (Object.keys(state.weights) as WeightKey[]).forEach((key) => {
    state.weights[key] = DEFAULT_WEIGHTS[key];
  });
  state.totalUpdates = 0;
  state.lastUpdatedAt = null;
}

/**
 * Возвращает метаданные онлайн-обновлений: кол-во апдейтов и временную метку.
 */
export function getUpdateMetadata(): { totalUpdates: number; lastUpdatedAt: Date | null } {
  return {
    totalUpdates: state.totalUpdates,
    lastUpdatedAt: state.lastUpdatedAt,
  };
}
