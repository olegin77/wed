const buckets = new Map<string, { tokens: number; ts: number }>();

export function allow(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: limit, ts: now };
  if (now - bucket.ts >= windowMs) {
    const windowsPassed = Math.floor((now - bucket.ts) / windowMs);
    bucket.tokens = Math.min(limit, bucket.tokens + windowsPassed * limit);
    bucket.ts = bucket.ts + windowsPassed * windowMs;
  }
  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}

export function reset(key?: string) {
  if (key) {
    buckets.delete(key);
  } else {
    buckets.clear();
  }
}
