/**
 * Online learning helper that tunes feature weights based on lightweight events.
 *
 * The module keeps a mutable weight vector in memory and exposes helpers to
 * update or observe it. All modifiers return fresh copies to prevent consumers
 * from mutating the internal state outside of the provided API.
 */

type WeightKey = "conv" | "rating" | "profile" | "calendar";

/**
 * Vector of weights that participate in the ML ranking formula.
 */
type WeightVector = Record<WeightKey, number>;

/**
 * Event that triggers a recalculation of the online weights.
 */
type UpdateEvent = {
  type: "click" | "book";
  delta: number;
};

/**
 * Baseline values calibrated offline (must sum up to 1.0).
 */
const DEFAULT_WEIGHTS: WeightVector = {
  conv: 0.55,
  rating: 0.2,
  profile: 0.2,
  calendar: 0.05,
};

/**
 * Helper array with the available weight keys. Used for iteration without
 * casting `Object.keys` results.
 */
const WEIGHT_KEYS: readonly WeightKey[] = ["conv", "rating", "profile", "calendar"];

/**
 * Mutable storage for the online weights. Always keep it normalized.
 */
const weights: WeightVector = { ...DEFAULT_WEIGHTS };

/**
 * Ensure the provided value stays within the inclusive [min, max] range.
 */
const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value));

/**
 * Apply delta to a particular weight key and clamp the result.
 */
function applyDelta(key: WeightKey, delta: number): void {
  weights[key] = clamp(weights[key] + delta);
}

/**
 * Restore the runtime weights back to the offline defaults.
 */
export function resetWeights(): WeightVector {
  for (const key of WEIGHT_KEYS) {
    weights[key] = DEFAULT_WEIGHTS[key];
  }
  return { ...weights };
}

/**
 * Normalize the weight vector to make sure it always sums up to 1.0. If the
 * cumulative weight becomes zero (due to negative deltas), the defaults are
 * restored to avoid division by zero.
 */
function normalizeWeights(): void {
  const total = WEIGHT_KEYS.reduce((sum, key) => sum + weights[key], 0);

  if (total <= 0) {
    resetWeights();
    return;
  }

  if (total !== 1) {
    const normalizer = 1 / total;
    for (const key of WEIGHT_KEYS) {
      weights[key] = clamp(weights[key] * normalizer);
    }
  }
}

/**
 * Update the weight vector in response to an online-learning event and return
 * a snapshot of the new weights.
 */
export function update(event: UpdateEvent): WeightVector {
  if (event.type === "click") {
    applyDelta("conv", event.delta * 0.0005);
    applyDelta("rating", event.delta * 0.0002);
  } else if (event.type === "book") {
    applyDelta("conv", event.delta * 0.001);
    applyDelta("profile", event.delta * 0.0005);
    applyDelta("calendar", event.delta * 0.0003);
  }

  normalizeWeights();
  return { ...weights };
}

/**
 * Return a defensive copy of the current weight vector.
 */
export function getWeights(): WeightVector {
  return { ...weights };
}
