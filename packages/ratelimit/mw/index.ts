import type { IncomingMessage, ServerResponse } from "node:http";
import { allow } from "../index";

export type KeyResolver = (req: IncomingMessage) => string;

/**
 * Creates a Node.js HTTP middleware that applies the primitive token bucket to
 * inbound requests. When the rate limit is exceeded, the middleware responds
 * with HTTP 429 and stops the pipeline.
 */
export function createRateLimitMiddleware(
  resolveKey: KeyResolver,
  limit = 60,
  windowMs = 60_000,
) {
  return function rateLimit(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const key = resolveKey(req);
    if (!allow(key, limit, windowMs)) {
      res.statusCode = 429;
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000).toString());
      res.end("rate_limited");
      return;
    }
    next();
  };
}
