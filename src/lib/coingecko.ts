export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
};

export type CoinDetail = {
  id: string;
  name: string;
  symbol: string;
  image: {
    small: string;
    large: string;
  };
  description: {
    en: string;
  };
  market_data: {
    market_cap: {
      usd: number | null;
    };
    current_price: {
      usd: number | null;
    };
  };
};

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "https://api.coingecko.com/api/v3";
}

export class CoinGeckoError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CoinGeckoError";
    this.status = status;
  }
}

async function cgFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new CoinGeckoError(`CoinGecko request failed (${res.status})`, res.status);
  }

  return res.json();
}

/**
 * Fetches the top 10 cryptocurrencies by market cap from CoinGecko API
 * @returns Promise resolving to an array of CoinMarket objects
 * @throws {CoinGeckoError} When the API request fails
 * 
 * Note: These functions are wrapped with server-side caching in API routes
 * React's cache() is not needed here since these are only called from API routes
 */
export async function getTopCoins(): Promise<CoinMarket[]> {
  return cgFetch<CoinMarket[]>(
    "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
  );
}

/**
 * Fetches detailed information about a specific cryptocurrency from CoinGecko API
 * @param id - The coin identifier (e.g., "bitcoin", "ethereum")
 * @returns Promise resolving to a CoinDetail object
 * @throws {CoinGeckoError} When the API request fails or coin ID is invalid
 */
export async function getCoinDetail(id: string): Promise<CoinDetail> {
  const sanitizedId = encodeURIComponent(id.trim());
  if (!sanitizedId || sanitizedId.length > 100) {
    throw new CoinGeckoError("Invalid coin ID", 400);
  }
  
  return cgFetch<CoinDetail>(
    `/coins/${sanitizedId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
}

/**
 * Fetches multiple coin details in parallel
 * @param ids - Array of coin identifiers
 * @returns Promise resolving to an array of CoinDetail objects
 */
export async function getCoinDetailsBatch(ids: string[]): Promise<CoinDetail[]> {
  // CoinGecko doesn't have a true batch endpoint, so we fetch in parallel
  // This is still more efficient than sequential fetches
  const promises = ids.map((id) => 
    getCoinDetail(id).catch((error) => {
      // Return null for failed fetches, we'll filter them out
      console.error(`Failed to fetch coin ${id}:`, error);
      return null;
    })
  );
  
  const results = await Promise.all(promises);
  return results.filter((coin): coin is CoinDetail => coin !== null);
}