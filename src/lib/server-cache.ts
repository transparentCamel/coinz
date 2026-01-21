/**
 * Simple in-memory cache for API routes
 * Prevents hitting external APIs too frequently
 * Supports tiered TTLs for different data types
 */

import { CACHE_DURATION_MS, STATIC_CACHE_DURATION_MS } from "./constants";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time-to-live in milliseconds
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Get cached data if it exists and is still valid
 */
function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  const now = Date.now();
  const age = now - entry.timestamp;

  // If cache is older than TTL, return null (cache expired)
  if (age > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set cached data with current timestamp and TTL
 */
function setCached<T>(key: string, data: T, ttl: number = CACHE_DURATION_MS): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Get or fetch data with caching
 * If data exists in cache and is fresh, return it immediately
 * Otherwise, fetch new data and cache it
 */
export async function getOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_DURATION_MS
): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();
  setCached(key, data, ttl);
  return data;
}

/**
 * Get cached data with stale-while-revalidate pattern
 * Returns stale data immediately if available, then fetches fresh data in background
 * @param refreshInterval - Optional separate interval for background refresh (defaults to ttl)
 */
export async function getOrFetchStale<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_DURATION_MS,
  refreshInterval?: number
): Promise<T> {
  const entry = cache.get(key);
  const refreshThreshold = refreshInterval ?? ttl;
  
  // If we have cached data (even if stale), return it immediately
  if (entry) {
    const data = entry.data as T;
    
    // If cache is older than refresh interval, fetch fresh data in background (non-blocking)
    const now = Date.now();
    const age = now - entry.timestamp;
    if (age > refreshThreshold) {
      // Fetch fresh data in background without awaiting
      fetcher().then((freshData) => {
        setCached(key, freshData, ttl);
      }).catch(() => {
        // Silently fail background refresh - we already have stale data
      });
    }
    
    return data;
  }

  // No cache, fetch fresh data
  const data = await fetcher();
  setCached(key, data, ttl);
  return data;
}

/**
 * Prefetch multiple items in parallel
 */
export async function prefetchMultiple<T>(
  items: Array<{ key: string; fetcher: () => Promise<T>; ttl?: number }>
): Promise<void> {
  await Promise.all(
    items.map(({ key, fetcher, ttl = CACHE_DURATION_MS }) =>
      getOrFetch(key, fetcher, ttl).catch(() => {
        // Silently fail individual prefetches - don't block others
      })
    )
  );
}

