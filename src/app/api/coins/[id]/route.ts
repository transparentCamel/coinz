import { NextResponse } from "next/server";
import { getCoinDetail, type CoinDetail } from "@/lib/coingecko";
import { getOrFetchStale } from "@/lib/server-cache";
import { CACHE_KEYS, ERROR_MESSAGES, STATIC_CACHE_DURATION_MS, CACHE_DURATION_MS } from "@/lib/constants";
import { sanitizeHtml } from "@/lib/sanitize";
import { CACHE_HEADERS, handleApiError } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Use stale-while-revalidate pattern:
    // - Return cached data immediately if available (even if stale)
    // - Refresh in background for next request
    // - Use longer TTL for static data (24h) since descriptions/images don't change often
    // - Price freshness: refresh prices every 1 minute in background, but keep static data cached for 24h
    const coin = await getOrFetchStale<CoinDetail>(
      CACHE_KEYS.COIN_DETAIL(id),
      () => getCoinDetail(id),
      STATIC_CACHE_DURATION_MS, // Cache full details for 24 hours
      CACHE_DURATION_MS // But refresh prices every 1 minute in background
    );
    
    // Sanitize HTML description on the server side before sending to client
    const sanitizedCoin: CoinDetail = {
      ...coin,
      description: {
        ...coin.description,
        en: sanitizeHtml(coin.description.en || "No description available for this coin."),
      },
    };
    
    return NextResponse.json(sanitizedCoin, {
      headers: CACHE_HEADERS,
    });
  } catch (e) {
    return handleApiError(e, ERROR_MESSAGES.UNEXPECTED_ERROR_COIN);
  }
}

