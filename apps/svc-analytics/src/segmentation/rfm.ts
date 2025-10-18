export interface RfmInput {
  recency: number;
  frequency: number;
  monetary: number;
}

export interface RfmScore {
  R: number;
  F: number;
  M: number;
  segment: string;
}

function bucket(value: number): number {
  if (value >= 0.8) return 5;
  if (value >= 0.6) return 4;
  if (value >= 0.4) return 3;
  if (value >= 0.2) return 2;
  return 1;
}

export function rfm(user: RfmInput): RfmScore {
  const recencyScore = bucket(1 - user.recency);
  const frequencyScore = bucket(user.frequency);
  const monetaryScore = bucket(user.monetary);
  const segment = `${recencyScore}${frequencyScore}${monetaryScore}`;
  return { R: recencyScore, F: frequencyScore, M: monetaryScore, segment };
}
