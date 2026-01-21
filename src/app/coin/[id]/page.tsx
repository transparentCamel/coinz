"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import useSWR from "swr";
import type { CoinDetail } from "@/lib/coingecko";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { ERROR_MESSAGES, USD_FORMATTER } from "@/lib/constants";
import { LoadingErrorState } from "@/components/loading-error-state";
import { getCoinDetailUrl } from "@/lib/use-coins";

/**
 * Extracts coin ID from Next.js params with proper type safety
 */
function getCoinId(params: { id?: string | string[] }): string | null {
  if (!params.id) return null;
  if (typeof params.id === "string") return params.id;
  if (Array.isArray(params.id) && params.id.length > 0) return params.id[0];
  return null;
}

export default function CoinPage() {
  const params = useParams();
  const id = getCoinId(params);
  
  if (!id) {
    return (
      <main className="min-h-screen bg-background text-foreground px-4 py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Alert variant="destructive" className="border-destructive/50 text-destructive">
            <AlertDescription>{ERROR_MESSAGES.INVALID_COIN_ID}</AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }
  
  const { data: coin, error, isLoading } = useSWR<CoinDetail>(
    id ? getCoinDetailUrl(id) : null,
    fetcher
  );

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Button variant="link" asChild>
            <Link href="/">← Back to list</Link>
          </Button>
        </div>

        <LoadingErrorState
          error={error}
          isLoading={isLoading}
          loadingMessage="Loading coin details..."
          errorMessage={ERROR_MESSAGES.LOAD_COIN}
        >
          {coin && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={coin.image.large || coin.image.small}
                    alt={`${coin.name} logo`}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border"
                    loading="eager"
                    priority
                    unoptimized
                  />
                  <div>
                    <CardTitle>{coin.name}</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-wide">
                      {coin.symbol}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-xs text-muted-foreground">Price</div>
                  <div className="text-lg font-semibold tabular-nums">
                    {coin.market_data.current_price.usd != null
                      ? USD_FORMATTER.format(coin.market_data.current_price.usd)
                      : "N/A"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Market cap
                    <span className="ml-1 font-medium">
                      {coin.market_data.market_cap.usd != null
                        ? USD_FORMATTER.format(coin.market_data.market_cap.usd)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <section className="space-y-2 text-sm leading-relaxed">
                <h2 className="text-sm font-semibold">Description</h2>
                <div className="prose max-w-none prose-sm dark:prose-invert">
                  {parse(
                    coin.description.en || "No description available for this coin."
                  )}
                </div>
              </section>
            </CardContent>
          </Card>
          )}
        </LoadingErrorState>
      </div>
    </main>
  );
}
