// Cache package
export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
}

export interface CacheItem<T> {
  value: T;
  expires: number;
  createdAt: number;
}

export class Cache<T = any> {
  private items = new Map<string, CacheItem<T>>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 1000, // 1000 items default
    };
  }

  set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const expires = now + (ttl || this.options.ttl);
    
    // Remove expired items if cache is full
    if (this.items.size >= this.options.maxSize) {
      this.cleanup();
    }
    
    this.items.set(key, {
      value,
      expires,
      createdAt: now,
    });
  }

  get(key: string): T | undefined {
    const item = this.items.get(key);
    
    if (!item) {
      return undefined;
    }
    
    if (Date.now() > item.expires) {
      this.items.delete(key);
      return undefined;
    }
    
    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    return this.items.delete(key);
  }

  clear(): void {
    this.items.clear();
  }

  size(): number {
    return this.items.size;
  }

  keys(): string[] {
    return Array.from(this.items.keys());
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, item] of this.items.entries()) {
      if (now > item.expires) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.items.delete(key));
    
    // If still full, remove oldest items
    if (this.items.size >= this.options.maxSize) {
      const sortedItems = Array.from(this.items.entries())
        .sort((a, b) => a[1].createdAt - b[1].createdAt);
      
      const toRemove = sortedItems.slice(0, this.items.size - this.options.maxSize + 1);
      toRemove.forEach(([key]) => this.items.delete(key));
    }
  }
}

// Global cache instance
export const globalCache = new Cache();

// Utility functions
export function get<T>(key: string): T | undefined {
  return globalCache.get(key);
}

export function set<T>(key: string, value: T, ttl?: number): void {
  globalCache.set(key, value, ttl);
}

export function del(key: string): boolean {
  return globalCache.delete(key);
}

export function clear(): void {
  globalCache.clear();
}