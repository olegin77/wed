export interface VendorEventStat {
  vendorId: string;
  enquiries: number;
  bookings: number;
  month: string; // YYYY-MM
}

export interface VendorDemandSummary {
  vendorId: string;
  conversionRate: number;
  hottestMonth: string | null;
}

export function summarizeVendorDemand(stats: VendorEventStat[]): VendorDemandSummary[] {
  const grouped = new Map<string, VendorEventStat[]>();
  stats.forEach((stat) => {
    const list = grouped.get(stat.vendorId) ?? [];
    list.push(stat);
    grouped.set(stat.vendorId, list);
  });

  return Array.from(grouped.entries()).map(([vendorId, vendorStats]) => {
    const totals = vendorStats.reduce(
      (acc, current) => {
        acc.enquiries += current.enquiries;
        acc.bookings += current.bookings;
        if (!acc.byMonth[current.month]) {
          acc.byMonth[current.month] = 0;
        }
        acc.byMonth[current.month] += current.enquiries;
        return acc;
      },
      { enquiries: 0, bookings: 0, byMonth: {} as Record<string, number> },
    );

    const conversionRate = totals.enquiries === 0 ? 0 : totals.bookings / totals.enquiries;
    const hottestMonth = Object.entries(totals.byMonth).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      vendorId,
      conversionRate: Math.round(conversionRate * 100) / 100,
      hottestMonth,
    };
  });
}
