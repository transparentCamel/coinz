"use client";

import { CoinTable } from "./components/coin-table";
import useSWR from "swr";
import type { CoinMarket } from "@/lib/coingecko";
import { fetcher } from "@/lib/fetcher";
import { ERROR_MESSAGES } from "@/lib/constants";
import { LoadingErrorState } from "@/components/loading-error-state";
import { usePrefetchCoinDetails, getTopCoinsUrl } from "@/lib/use-coins";

export default function HomePage() {
  const { data: coins, error, isLoading } = useSWR<CoinMarket[]>(
    getTopCoinsUrl(),
    fetcher
  );

  // Prefetch all coin details when coins list loads
  // This prevents API rate limit issues when navigating between coins
  usePrefetchCoinDetails(coins);

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              CryptoQuick
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Top 10 cryptocurrencies by market cap
            </p>
          </div>
        </header>

        <LoadingErrorState
          error={error}
          isLoading={isLoading}
          loadingMessage="Loading coins..."
          errorMessage={ERROR_MESSAGES.LOAD_COINS}
        >
          {coins ? <CoinTable coins={coins} /> : null}
        </LoadingErrorState>
      </div>
    </main>
  );
}
