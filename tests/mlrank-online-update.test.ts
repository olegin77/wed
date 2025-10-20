import assert from "node:assert/strict";
import test from "node:test";

import { getWeights, resetWeights, update } from "../packages/mlrank/online/update";

type WeightVector = ReturnType<typeof getWeights>;

const sum = (weights: WeightVector): number =>
  Object.values(weights).reduce((acc, value) => acc + value, 0);

const approximatelyEqual = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) <= eps;

const DEFAULT_WEIGHTS: WeightVector = {
  conv: 0.55,
  rating: 0.2,
  profile: 0.2,
  calendar: 0.05,
};

test("resetWeights restores the offline defaults", () => {
  const updated = update({ type: "book", delta: 1000 });
  assert.notDeepEqual(updated, DEFAULT_WEIGHTS);

  const reset = resetWeights();
  assert.deepEqual(reset, DEFAULT_WEIGHTS);
  assert.deepEqual(getWeights(), DEFAULT_WEIGHTS);
});

test("update applies deltas and keeps the weights normalized", () => {
  resetWeights();

  const afterClick = update({ type: "click", delta: 400 });
  assert(afterClick.conv > DEFAULT_WEIGHTS.conv);
  assert(afterClick.rating > DEFAULT_WEIGHTS.rating);

  const afterBook = update({ type: "book", delta: 600 });
  assert(afterBook.profile > afterClick.profile);
  assert(afterBook.calendar > afterClick.calendar);

  assert(approximatelyEqual(sum(afterBook), 1));
});

test("getWeights returns a defensive copy of the internal state", () => {
  resetWeights();

  const snapshot = getWeights();
  snapshot.conv = 0;

  assert.notDeepEqual(snapshot, getWeights());
});
