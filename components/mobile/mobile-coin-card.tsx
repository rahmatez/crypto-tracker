"use client";

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { MarketCoin } from '@/lib/types';
import type { Currency } from '@/lib/storage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CoinImage } from '@/components/coin-image';
import { formatCurrency, formatPercent } from '@/lib/format';
import { WatchToggle } from '@/components/watch-toggle';
import { Sparkline } from '@/components/sparkline';
import { cn } from '@/lib/utils';

interface MobileCoinCardProps {
  coin: MarketCoin;
  currency: Currency;
}

export function MobileCoinCard({ coin, currency }: MobileCoinCardProps) {
  const change24h = coin.price_change_percentage_24h_in_currency ?? 0;
  const change7d = coin.price_change_percentage_7d_in_currency ?? 0;
  const isPositive = change24h >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const volumeRatio = coin.market_cap ? (coin.total_volume / coin.market_cap) * 100 : 0;

  return (
    <Card variant="ghost" className="mb-3 border-border/70 bg-card/70">
      <CardHeader className="mb-4 gap-3">
        <div className="flex items-center gap-3">
          <CoinImage
            src={coin.image}
            alt={`${coin.name} logo`}
            width={40}
            height={40}
            className="rounded-full border border-border/60 bg-background"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate text-base">{coin.name}</CardTitle>
            <p className="typography-small text-muted-foreground">{coin.symbol.toUpperCase()}</p>
          </div>
          <div className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', isPositive ? 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]' : 'bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]')}>
            <TrendIcon className="h-3.5 w-3.5" aria-hidden />
            {formatPercent(change24h)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="typography-small text-muted-foreground">Price</p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatCurrency(coin.current_price, currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="typography-small text-muted-foreground">7d</p>
            <p className={cn('text-sm font-semibold', change7d >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]')}>
              {formatPercent(change7d)}
            </p>
          </div>
        </div>

        {coin.sparkline_in_7d?.price?.length ? (
          <div className="rounded-xl border border-border/60 bg-background/60 p-3">
            <Sparkline data={coin.sparkline_in_7d.price} />
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div>
            <p className="uppercase tracking-wider">Market Cap</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatCurrency(coin.market_cap, currency)}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-wider">24h Volume</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatCurrency(coin.total_volume, currency)}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-wider">Rank</p>
            <p className="mt-1 text-sm font-semibold text-foreground">#{coin.market_cap_rank ?? '—'}</p>
          </div>
          <div>
            <p className="uppercase tracking-wider">Volume / Cap</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatPercent(volumeRatio)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <WatchToggle coinId={coin.id} />
      </CardFooter>
    </Card>
  );
}
