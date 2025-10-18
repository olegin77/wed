import type { UtmSession } from "../../../../packages/attribution";

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  [key: string]: unknown;
}

export function attachUtm<T extends Invoice>(invoice: T, utm: UtmSession) {
  return { ...invoice, utm };
}
