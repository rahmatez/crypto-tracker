import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { MarketCoin } from '@/lib/types';
import { CoinCard } from './coin-card';
import type { Currency } from '@/lib/storage';
import { Button } from './ui/button';
import Link from 'next/link';

interface MoversProps {
  gainers: MarketCoin[];
  losers: MarketCoin[];
  currency: Currency;
}

export function Movers({ gainers, losers, currency }: MoversProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Top Movers</h2>
          <p className="text-sm text-muted-foreground">
            Leaders and laggards over the past 24 hours.
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/watchlist">View Watchlist</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {gainers.map((coin) => (
          <CoinCard key={`gainer-${coin.id}`} coin={coin} currency={currency} />
        ))}
        {losers.map((coin) => (
          <CoinCard key={`loser-${coin.id}`} coin={coin} currency={currency} />
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 text-emerald-500">
          <ArrowUpRight className="h-3.5 w-3.5" /> Gainers
        </span>
        <span className="flex items-center gap-1 text-red-500">
          <ArrowDownRight className="h-3.5 w-3.5" /> Losers
        </span>
      </div>
    </section>
  );
}
