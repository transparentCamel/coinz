"use client";

import { SWRConfig } from "swr";
import { CACHE_DURATION_MS } from "@/lib/constants";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        // Dedupe requests within 1 minute
        // This prevents duplicate API calls within 1 minute, effectively caching data for 1 minute
        dedupingInterval: CACHE_DURATION_MS,
        // Don't revalidate on focus to respect API rate limits
        revalidateOnFocus: false,
        // Don't revalidate on reconnect
        revalidateOnReconnect: false,
        // Disable automatic polling
        refreshInterval: 0,
        // Error retry configuration
        errorRetryCount: 2,
        errorRetryInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}

