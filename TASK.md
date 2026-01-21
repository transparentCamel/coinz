# Front-end Developer Challenge: "CryptoQuick" (2-4h)

Create a simplified cryptocurrency price tracker using Next.js 16+ (App Router), TypeScript, Tailwind CSS, and shadcn/ui components. You have flexibility in how you structure and implement the solution.

## ✅ Required Features

1. **Price List:** Display top 10 coins from [CoinGecko API](https://www.coingecko.com/en/api/documentation) showing name, symbol, price, and 24h change.
2. **Search:** Client-side search to filter coins by name.
3. **Watchlist:** "Star" button on each coin. Persist favorites in `localStorage` and keep them highlighted after refresh.
4. **Detail Page:** Dynamic route `/coin/[id]` showing coin description and market cap.

## 🛠 Setup

1. Install: `npm install`
2. API: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`
3. Create `.env.example` (best practice, even if no key needed)
4. Run: `npm run dev`

## 💡 Evaluation Focus

* Error handling (API rate limits)
* Hydration handling (`localStorage` in Next.js)
* TypeScript types (avoid `any`)

## 📤 Submission

Once completed, send the link to your GitHub repository to **deiminas@netzet.com**.

Good luck! 🚀