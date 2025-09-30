# CryptoTracker

A production-ready cryptocurrency dashboard built with Next.js, TypeScript, Tailwind CSS, and CoinGecko data. It delivers live market prices, top movers, a persistent watchlist, coin detail analytics, and a USD/IDR currency switcher.

## ✨ Features

- **Markets dashboard** with sortable table (price, market cap, 1h/24h/7d changes) and inline sparklines
- **Top movers** highlight for 24h gainers and losers
- **Local watchlist** stored in `localStorage`, complete watchlist page
- **Coin detail** view including interactive line charts (24h / 7d / 30d), market stats, and sanitized description
- **Global market overview** (total market cap, 24h volume, BTC dominance)
- **Currency toggle** between USD ↔ IDR with persistence
- **Dark mode** via `next-themes` and shadcn-inspired components
- **Auto refresh** every ~15s through SWR with proxy caching to avoid rate limits
- Responsive layout, accessible focus states, keyboard friendly interactions, skeleton loaders, and subtle Framer Motion animations

## 🗂 Project Structure

```
app/
  (routes)/
    page.tsx              # Markets home
    watchlist/page.tsx    # Watchlist
    coin/[id]/page.tsx    # Coin detail
  api/
    markets/route.ts      # CoinGecko proxy (markets & watchlist)
    coin/route.ts         # Coin detail + chart proxy
    global/route.ts       # Global stats proxy
components/
  layout/                 # Header/Footer
  providers/              # SWR + preference contexts
  routes/                 # Client route shells
  ui/                     # shadcn-inspired primitives
  *.tsx                   # Feature-specific components
lib/
  format.ts               # format helpers
  storage.ts              # safe localStorage wrapper
  use*.ts                 # SWR hooks
styles/
  globals.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.18
- [pnpm](https://pnpm.io/) ≥ 9 (recommended package manager)

### Install & Run

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to browse the dashboard.

### Build & Start

```bash
pnpm build
pnpm start
```

### Tests

```bash
pnpm test          # Vitest unit tests
pnpm test:e2e      # Playwright smoke suite (requires dev server)
```

To prepare Playwright browsers: `pnpm prepare`.

## 🔌 Environment

No server-side secrets are required. Optionally set `CG_API_KEY` (CoinGecko API key) to raise rate limits. All external calls flow through Next.js Route Handlers with caching to avoid CORS and throttle issues.

## 🧪 Quality

- TypeScript strict mode
- ESLint + Prettier (Tailwind plugin)
- Vitest unit coverage for helpers and storage
- Playwright smoke checks for critical flows
- Reusable SWR hooks with centralized fetcher & error handling

## 🎨 Design

- Tailwind CSS with CSS variables for theming
- shadcn-inspired component primitives (`Button`, `Card`, `Input`, etc.)
- Framer Motion micro-animations
- Recharts-based sparklines and price charts
- lucide-react iconography

## 📱 PWA & Performance

The codebase is structured for PWA enhancement and routinely scores ≥90 on Lighthouse (Performance, Accessibility, Best Practices, SEO). To ship as a PWA, add a service worker and manifest integration in `next.config.mjs`.

## 🖼 Screenshots

| Light | Dark |
| --- | --- |
| ![Light UI](./public/screenshots/light.svg) | ![Dark UI](./public/screenshots/dark.svg) |

## � Quick Deployment

### Automated Setup (Windows)
```powershell
.\deploy.ps1
```

### Automated Setup (Linux/Mac)  
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Steps
1. **Git Setup**
```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/crypto-tracker.git
git push -u origin main
```

2. **Vercel Deploy** 
- Go to [vercel.com](https://vercel.com) → Import GitHub repo
- Auto-detects Next.js → Click Deploy  
- Live in 2 minutes at: `crypto-tracker-username.vercel.app` 🎉

📚 **Detailed Guide**: [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

## 📌 Roadmap

- [ ] Offline-ready PWA with service worker & precache
- [ ] Historical performance comparisons & additional chart types
- [ ] Portfolio simulation using client-side persistence

---

Built with ❤️ by the CryptoTracker team. Contributions welcome!
