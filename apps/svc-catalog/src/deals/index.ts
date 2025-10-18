export interface CatalogDeal {
  id: string;
  vendorId: string;
  title: string;
  description?: string;
  discountPercent: number;
  activeUntil: string; // ISO date
}

export function listActiveDeals(deals: CatalogDeal[], reference: Date = new Date()): CatalogDeal[] {
  const now = reference.getTime();
  return deals.filter((deal) => new Date(deal.activeUntil).getTime() >= now);
}
