export type ChurnInput = {
  daysInactive: number;
  enquiries: number;
};

export interface ChurnSignal {
  daysInactive: number;
  enquiries: number;
  sessionsLast30d: number;
  paymentsLast90d: number;
}

const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value));

export function churnScore(signal: ChurnInput | ChurnSignal): number {
  if ('sessionsLast30d' in signal) {
    // ChurnSignal
    const inactivity = signal.daysInactive / 30;
    const engagementBoost = 0.1 * signal.enquiries + 0.05 * signal.sessionsLast30d + 0.15 * signal.paymentsLast90d;
    return clamp(inactivity - engagementBoost, 0, 1);
  } else {
    // ChurnInput
    const inactivityComponent = signal.daysInactive / 30;
    const engagementComponent = 0.1 * signal.enquiries;
    const raw = inactivityComponent - engagementComponent;
    return Math.min(1, Math.max(0, raw));
  }
}
