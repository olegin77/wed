export interface AvailabilityWindow {
  date: string; // YYYY-MM-DD
  isHighDemand?: boolean;
  vendorIds: string[];
}

export function suggestDates(
  windows: AvailabilityWindow[],
  preferredVendors: string[],
  limit = 3,
): string[] {
  const preferred = new Set(preferredVendors);
  const scored = windows.map((window) => {
    const vendorScore = window.vendorIds.reduce(
      (score, vendorId) => score + (preferred.has(vendorId) ? 2 : 1),
      0,
    );
    const demandPenalty = window.isHighDemand ? 0.5 : 1;
    return {
      date: window.date,
      score: vendorScore * demandPenalty,
    };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.date);
}
