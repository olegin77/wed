export interface RankInput {
  conversion: number;
  rating: number;
  profile: number;
  availability: number;
}

const WEIGHTS: RankInput = {
  conversion: 0.5,
  rating: 0.2,
  profile: 0.2,
  availability: 0.1,
};

function clamp(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function score(input: RankInput): number {
  return (
    clamp(input.conversion) * WEIGHTS.conversion +
    clamp(input.rating) * WEIGHTS.rating +
    clamp(input.profile) * WEIGHTS.profile +
    clamp(input.availability) * WEIGHTS.availability
  );
}
