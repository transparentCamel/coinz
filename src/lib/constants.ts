/**
 * Application-wide constants
 * Centralized location for all magic numbers, strings, and configuration values
 */

// Cache configuration - tiered TTLs for different data types
export const CACHE_DURATION_MS = 60 * 1000; // 1 minute for prices
export const STATIC_CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours for static data (descriptions, images, etc.)

// Cache keys
export const CACHE_KEYS = {
  TOP_COINS: 'top-coins',
  COIN_DETAIL: (id: string) => `coin-detail-${id}`,
  COIN_STATIC: (id: string) => `coin-static-${id}`, // Static data: description, images, etc.
  COIN_PRICE: (id: string) => `coin-price-${id}`, // Dynamic data: price, market cap
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  WATCHLIST: 'cryptoquick_watchlist',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  LOAD_COINS: "Failed to load coins — CoinGecko may be rate limiting. Please try again in a moment.",
  LOAD_COIN: "Failed to load coin — CoinGecko may be rate limiting. Please try again in a moment.",
  INVALID_COIN_ID: "Invalid coin ID",
  UNEXPECTED_ERROR_COINS: "Unexpected error while loading coins",
  UNEXPECTED_ERROR_COIN: "Unexpected error while loading coin",
} as const;

// Formatters
export const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

// Input validation
export const MAX_SEARCH_LENGTH = 100;

