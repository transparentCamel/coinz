import { NextResponse } from "next/server";
import { getTopCoins, getCoinDetail } from "@/lib/coingecko";
import { getOrFetch, prefetchMultiple } from "@/lib/server-cache";
import { CACHE_KEYS, STATIC_CACHE_DURATION_MS } from "@/lib/constants";
import { handleApiError, CACHE_HEADERS } from "@/lib/api-utils";

/**
 * Prefetch endpoint that loads all coin details in parallel
 * This helps avoid rate limits when users navigate between coins
 * Fetches all coin details in parallel and caches them with long TTL for static data
 */
export async function POST() {
  try {
    // First, get the top coins list (or use cached version)
    const coins = await getOrFetch(CACHE_KEYS.TOP_COINS, () => getTopCoins());
    
    // Extract coin IDs
    const coinIds = coins.map((coin) => coin.id);
    
    // Prefetch all coin details in parallel
    // Each fetch is cached individually with 24h TTL for static data
    // Prices will be refreshed more frequently via stale-while-revalidate
    await prefetchMultiple(
      coinIds.map((id) => ({
        key: CACHE_KEYS.COIN_DETAIL(id),
        fetcher: () => getCoinDetail(id),
        ttl: STATIC_CACHE_DURATION_MS, // Cache full details for 24 hours
      }))
    );
    
    return NextResponse.json(
      { success: true, prefetched: coinIds.length },
      { headers: CACHE_HEADERS }
    );
  } catch (e) {
    return handleApiError(e, "Failed to prefetch coin details");
  }
}

