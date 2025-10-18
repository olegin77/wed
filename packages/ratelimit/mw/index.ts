import { allow } from "../index";

type LimitOptions = {
  limit?: number;
  windowMs?: number;
};

export function check(key: string, { limit = 60, windowMs = 60_000 }: LimitOptions = {}) {
  return allow(key, limit, windowMs);
}

export function express(options: { key: (req: any) => string } & LimitOptions) {
  return function rateLimitMiddleware(req: any, res: any, next: () => void) {
    const key = options.key(req);
    const ok = allow(key, options.limit ?? 60, options.windowMs ?? 60_000);
    if (!ok) {
      res.statusCode = 429;
      res.setHeader("Retry-After", Math.ceil((options.windowMs ?? 60_000) / 1000));
      res.end("Too Many Requests");
      return;
    }
    next();
  };
}
