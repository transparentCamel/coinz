import { NextResponse } from "next/server";
import { CoinGeckoError } from "./coingecko";
import { ERROR_MESSAGES } from "./constants";

/**
 * Cache-Control header configuration for API responses
 */
export const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60",
} as const;

/**
 * Handles errors from API routes consistently
 * @param error - The error that occurred
 * @param defaultErrorMessage - Default error message if error is not a CoinGeckoError
 * @returns NextResponse with appropriate error status and message
 */
export function handleApiError(
  error: unknown,
  defaultErrorMessage: string
): NextResponse {
  if (error instanceof CoinGeckoError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  // Log unexpected errors server-side only
  if (process.env.NODE_ENV === 'development') {
    console.error('Unexpected error:', error);
  }

  return NextResponse.json(
    { error: defaultErrorMessage },
    { status: 500 }
  );
}

