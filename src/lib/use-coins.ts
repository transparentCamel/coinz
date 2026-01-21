/**
 * Custom hooks and utilities for fetching coin data
 * Centralizes all coin-related data fetching logic
 */

import { useEffect } from "react";
import { useSWRConfig, type MutatorCallback } from "swr";
import type { CoinMarket, CoinDetail } from "./coingecko";
import { fetcher } from "./fetcher";

/**
 * Prefetches coin details for all coins in the list
 * Uses SWR's mutate to leverage caching and deduplication
 * 
 * @param coins - Array of coins to prefetch details for
 */
export function usePrefetchCoinDetails(coins: CoinMarket[] | undefined) {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!coins || coins.length === 0) {
      return;
    }

    // Prefetch all coin detail endpoints in parallel using SWR's mutate
    // mutate(key, fetcher) will fetch and cache data if not already cached
    // SWR's deduplication ensures we don't make duplicate requests
    coins.forEach((coin) => {
      const key = `/api/coins/${encodeURIComponent(coin.id)}`;
      // Use mutate to prefetch - fetcher will be called if data isn't cached
      mutate(key, () => fetcher<CoinDetail>(key)).catch(() => {
        // Silently fail - prefetch is optional
      });
    });
  }, [coins, mutate]);
}

/**
 * Gets the API endpoint URL for a coin detail
 */
export function getCoinDetailUrl(coinId: string): string {
  return `/api/coins/${encodeURIComponent(coinId)}`;
}

/**
 * Gets the API endpoint URL for the top coins list
 */
export function getTopCoinsUrl(): string {
  return "/api/coins";
}

