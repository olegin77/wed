const store = new Map<string, { v: any; ttl: number }>();

export function get<T = any>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.ttl < Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.v as T;
}

export function set(key: string, value: any, ms = 60000) {
  store.set(key, { v: value, ttl: Date.now() + ms });
}
