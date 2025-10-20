const buckets = new Map<string, { tokens: number; ts: number }>();

/**
 * Primitive in-memory token bucket implementation. Intended for local testing
 * and single-instance services; distributed deployments should replace it with
 * Redis or another central store.
 *
 * @param key Unique identifier per consumer (e.g. IP or user ID).
 * @param limit Number of tokens available per window.
 * @param windowMs Duration of the replenishment window in milliseconds.
 */
export function allow(key: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: limit, ts: now };

  const elapsed = now - bucket.ts;
  if (elapsed >= windowMs) {
    const windowsPassed = Math.floor(elapsed / windowMs);
    bucket.tokens = Math.min(limit, bucket.tokens + windowsPassed * limit);
    bucket.ts = now;
  }

  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.tokens -= 1;
  bucket.ts = now;
  buckets.set(key, bucket);
  return true;
}

/**
 * Resets the internal storage. Handy for tests to avoid cross-test leakage.
 */
export function reset() {
  buckets.clear();
}
