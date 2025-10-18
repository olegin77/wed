type WeightKey = "conv" | "rating" | "profile" | "calendar";

type WeightVector = Record<WeightKey, number>;

type UpdateEvent = {
  type: "click" | "book";
  delta: number;
};

const weights: WeightVector = {
  conv: 0.55,
  rating: 0.2,
  profile: 0.2,
  calendar: 0.05,
};

const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value));

function applyDelta(key: WeightKey, delta: number): void {
  weights[key] = clamp(weights[key] + delta);
}

export function update(event: UpdateEvent): WeightVector {
  if (event.type === "click") {
    applyDelta("conv", event.delta * 0.0005);
    applyDelta("rating", event.delta * 0.0002);
  } else if (event.type === "book") {
    applyDelta("conv", event.delta * 0.001);
    applyDelta("profile", event.delta * 0.0005);
    applyDelta("calendar", event.delta * 0.0003);
  }

  const total = weights.conv + weights.rating + weights.profile + weights.calendar;
  if (total !== 1) {
    const normalizer = 1 / total;
    (Object.keys(weights) as WeightKey[]).forEach((key) => {
      weights[key] = clamp(weights[key] * normalizer);
    });
  }

  return { ...weights };
}

export function getWeights(): WeightVector {
  return { ...weights };
}
