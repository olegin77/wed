import { set as setCacheEntry } from "../../../packages/cache";
import { notifyCatalogUpdated } from "../webhooks/dispatch.js";

const CATALOG_CACHE_PREFIX = "catalog:";

/**
 * Invalidates the cached search results for a specific city.
 * The cache layer is an in-memory stub that emulates Redis semantics.
 *
 * @param {string} city - City identifier used as part of the cache key.
 * @returns {Promise<void>} Resolves once the cache entry is expired.
 */
export async function invalidateCity(city: string): Promise<void> {
  if (!city) {
    return;
  }

  setCacheEntry(`${CATALOG_CACHE_PREFIX}${city}`, null, 1);

  try {
    await notifyCatalogUpdated(city);
  } catch (error) {
    console.error("catalog_invalidate_notify_error", error);
  }
}
