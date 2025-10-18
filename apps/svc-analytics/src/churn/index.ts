export interface ChurnSignal {
  daysInactive: number;
  enquiries: number;
  sessionsLast30d: number;
  paymentsLast90d: number;
}

const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value));

export function churnScore(signal: ChurnSignal): number {
  const inactivity = signal.daysInactive / 30;
  const engagementBoost = 0.1 * signal.enquiries + 0.05 * signal.sessionsLast30d + 0.15 * signal.paymentsLast90d;
  return clamp(inactivity - engagementBoost, 0, 1);
}
