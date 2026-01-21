"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORAGE_KEYS, USD_FORMATTER, PERCENT_FORMATTER, MAX_SEARCH_LENGTH } from "@/lib/constants";

import type { CoinMarket } from "@/lib/coingecko";

type CoinTableProps = { coins: CoinMarket[] };

export function CoinTable({ coins }: CoinTableProps) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Hydration-safe localStorage usage
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          setWatchlist(parsed);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("Failed to load watchlist from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("Failed to save watchlist to localStorage:", error);
      }
    }
  }, [watchlist, mounted]);

  const filtered = useMemo(
    () =>
      coins.filter((coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [coins, query]
  );

  const toggleWatch = useCallback(
    (id: string) => {
      setWatchlist((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    []
  );

  const isWatched = useCallback(
    (id: string) => watchlist.includes(id),
    [watchlist]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= MAX_SEARCH_LENGTH) {
              setQuery(value);
            }
          }}
          placeholder="Search by name..."
          className="max-w-xs"
          maxLength={MAX_SEARCH_LENGTH}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Watch</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((coin) => {
              const change = coin.price_change_percentage_24h ?? 0;
              const positive = change >= 0;
              const watched = mounted && isWatched(coin.id);

              return (
                <TableRow
                  key={coin.id}
                  className={cn(watched && "bg-amber-50/40 dark:bg-amber-500/5")}
                >
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
                      onClick={() => toggleWatch(coin.id)}
                      className="h-8 w-8"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          watched
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground"
                        )}
                      />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={coin.image}
                        alt={`${coin.name} logo`}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full border"
                        loading="lazy"
                        unoptimized
                      />
                      <div>
                        <div className="font-medium leading-none">
                          {coin.name}
                        </div>
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {USD_FORMATTER.format(coin.current_price)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span
                      className={
                        positive ? "text-emerald-500" : "text-red-500"
                      }
                    >
                      {positive ? "+" : ""}
                      {PERCENT_FORMATTER.format(change / 100)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" asChild className="h-auto p-0">
                      <Link href={`/coin/${coin.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  className="h-24 text-center text-muted-foreground"
                  aria-live="polite"
                  role="status"
                >
                  No coins match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
