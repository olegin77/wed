import type { UtmSession } from "../../../../packages/attribution";
import type { Invoice } from "./index";

export type { Invoice };

/**
 * Returns a copy of the invoice enriched with the provided UTM session.
 */
export function attachUtm<T extends Invoice>(invoice: T, utm: UtmSession) {
  return { ...invoice, utm };
}
