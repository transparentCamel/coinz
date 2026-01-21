/**
 * Shared fetcher function for SWR
 * Handles API errors consistently across the application
 * @param url - The API endpoint URL to fetch
 * @returns Promise resolving to the parsed JSON response
 * @throws {Error} When the request fails or response is not ok
 */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ 
      error: `Request failed (${res.status})` 
    }));
    throw new Error(error.error || `Request failed (${res.status})`);
  }
  return res.json();
}

