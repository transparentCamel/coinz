import { NextResponse } from "next/server";
import { getTopCoins } from "@/lib/coingecko";
import { getOrFetchStale } from "@/lib/server-cache";
import { CACHE_KEYS, ERROR_MESSAGES, CACHE_DURATION_MS } from "@/lib/constants";
import { CACHE_HEADERS, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    // Use stale-while-revalidate for better performance
    // Returns cached data immediately, refreshes in background
    // Cache duration is 1 minute for price data
    const coins = await getOrFetchStale(
      CACHE_KEYS.TOP_COINS,
      () => getTopCoins(),
      CACHE_DURATION_MS
    );
    
    return NextResponse.json(coins, {
      headers: CACHE_HEADERS,
    });
  } catch (e) {
    return handleApiError(e, ERROR_MESSAGES.UNEXPECTED_ERROR_COINS);
  }
}

