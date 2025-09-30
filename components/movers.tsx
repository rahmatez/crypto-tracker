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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="typography-h2">Top Movers</h2>
          <p className="typography-body mt-1">
            Leaders and laggards over the past 24 hours.
          </p>
        </div>
        <Button variant="ghost" asChild className="self-start md:self-auto">
          <Link href="/watchlist">View Watchlist</Link>
        </Button>
      </div>
      <div className="card-grid">
        {gainers.map((coin) => (
          <CoinCard key={`gainer-${coin.id}`} coin={coin} currency={currency} />
        ))}
        {losers.map((coin) => (
          <CoinCard key={`loser-${coin.id}`} coin={coin} currency={currency} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--success)/0.15)] px-3 py-1 text-[hsl(var(--success))]">
          <ArrowUpRight className="h-3.5 w-3.5" /> Gainers
        </span>
        <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--destructive)/0.15)] px-3 py-1 text-[hsl(var(--destructive))]">
          <ArrowDownRight className="h-3.5 w-3.5" /> Losers
        </span>
      </div>
    </div>
  );
}
