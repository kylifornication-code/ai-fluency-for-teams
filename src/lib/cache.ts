/**
 * Simple in-memory cache for OpenAI responses.
 * On Vercel serverless each function instance has its own cache,
 * so this reduces repeat calls within the same warm instance.
 * For persistent cross-instance caching, swap with Vercel KV or Upstash Redis.
 */

interface CacheEntry {
  value: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export function cacheKey(...parts: (string | undefined)[]): string {
  return parts
    .map((p) => (p || "").toLowerCase().trim())
    .join("::");
}

export function getCache(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

export function setCache(key: string, value: string): void {
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS });
}
