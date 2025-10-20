# Rate limiting primitives

- **Modules:**
  - `packages/ratelimit/index.ts` — token bucket helper with `allow()` and `reset()`.
  - `packages/ratelimit/mw/index.ts` — wraps the helper into a Node HTTP middleware returning `429` with `Retry-After`.
- **Storage:** In-memory `Map` keyed by consumer identifier; suited only for single-instance services.
- **Reset:** Call `reset()` in tests or when redeploying workers to avoid stale buckets.
- **Next steps:** Replace with Redis-backed shared storage before enabling horizontally scaled workloads.
