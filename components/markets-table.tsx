"use client";

import { ArrowUpDown, RefreshCcw, Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { MarketCoin } from '@/lib/types';
import type { Currency } from '@/lib/storage';
import { formatCurrency, formatPercent, trendClass } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sparkline } from './sparkline';
import { WatchToggle } from './watch-toggle';
import { CoinImage } from './coin-image';
import type { SortDirection, SortKey } from '@/lib/useMarkets';
import { Skeleton } from './ui/skeleton';
import { MobileCoinCard } from './mobile/mobile-coin-card';

interface MarketsTableProps {
  coins: MarketCoin[];
  currency: Currency;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const headers: Array<{ label: string; key?: SortKey; align?: 'left' | 'right' }> = [
  { label: '#', key: 'market_cap', align: 'left' },
  { label: 'Coin' },
  { label: 'Price', key: 'price', align: 'right' },
  { label: '1h', key: 'change_24h', align: 'right' },
  { label: '24h', key: 'change_24h', align: 'right' },
  { label: '7d', key: 'change_7d', align: 'right' },
  { label: 'Market Cap', key: 'market_cap', align: 'right' },
  { label: 'Volume', align: 'right' },
  { label: 'Sparkline' },
  { label: 'Watch' }
];

export function MarketsTable({
  coins,
  currency,
  sortDirection,
  sortKey,
  onSortChange,
  searchTerm,
  onSearchTermChange,
  isLoading,
  onRefresh
}: MarketsTableProps) {
  const totalAssets = coins.length;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
        <div className="section-header">
          <div>
            <h2 className="typography-h2">Market Overview</h2>
            <p className="typography-body mt-1">
              Track {totalAssets || '—'} cryptocurrencies and spot emerging trends.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 text-sm text-muted-foreground sm:w-64">
              <Search className="h-4 w-4" aria-hidden />
              <Input
                value={searchTerm}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onSearchTermChange(event.target.value)
                }
                placeholder="Search by name or symbol"
                aria-label="Search coins"
                className="h-8 border-0 bg-transparent px-0 py-0 text-sm focus-visible:ring-0"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              type="button"
              aria-label="Refresh markets"
              className="h-10 w-10 rounded-full"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 hidden md:block">
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/70 shadow-inner">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70">
            <thead className="bg-muted/40">
              <tr>
                {headers.map(({ label, key, align }) => (
                  <th
                    key={label}
                    scope="col"
                    className={cn(
                      'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                      align === 'right' ? 'text-right' : 'text-left'
                    )}
                  >
                    {key ? (
                      <button
                        className="flex items-center gap-1"
                        onClick={() => onSortChange(key)}
                        type="button"
                      >
                        <span>{label}</span>
                        <ArrowUpDown
                          className={cn(
                            'h-3.5 w-3.5 transition-transform duration-200',
                            sortKey === key
                              ? sortDirection === 'asc'
                                ? 'text-primary rotate-180'
                                : 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        />
                      </button>
                    ) : (
                      label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading
                ? [...Array(10)].map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-6" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="mb-2 h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-4 w-16" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-4 w-12" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-4 w-12" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-4 w-12" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-4 w-20" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="ml-auto h-4 w-20" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-12 w-28" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </td>
                    </tr>
                  ))
                : coins.map((coin) => {
                    const priceChange1h = coin.price_change_percentage_1h_in_currency ?? 0;
                    const priceChange24h = coin.price_change_percentage_24h_in_currency ?? 0;
                    const priceChange7d = coin.price_change_percentage_7d_in_currency ?? 0;

                    return (
                      <tr key={coin.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-5 py-4 text-sm font-semibold text-muted-foreground">
                          {coin.market_cap_rank}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <CoinImage
                              src={coin.image}
                              alt={`${coin.name} logo`}
                              width={32}
                              height={32}
                              className="rounded-full border border-border/80 bg-background"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">{coin.name}</p>
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                {coin.symbol}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-semibold text-foreground">
                          {formatCurrency(coin.current_price, currency)}
                        </td>
                        <td className={cn('px-5 py-4 text-right text-xs font-semibold', trendClass(priceChange1h))}>
                          {formatPercent(priceChange1h)}
                        </td>
                        <td className={cn('px-5 py-4 text-right text-xs font-semibold', trendClass(priceChange24h))}>
                          {formatPercent(priceChange24h)}
                        </td>
                        <td className={cn('px-5 py-4 text-right text-xs font-semibold', trendClass(priceChange7d))}>
                          {formatPercent(priceChange7d)}
                        </td>
                        <td className="px-5 py-4 text-right text-sm text-muted-foreground">
                          {formatCurrency(coin.market_cap, currency)}
                        </td>
                        <td className="px-5 py-4 text-right text-sm text-muted-foreground">
                          {formatCurrency(coin.total_volume, currency)}
                        </td>
                        <td className="px-5 py-4">
                          <Sparkline data={coin.sparkline_in_7d?.price ?? []} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <WatchToggle coinId={coin.id} />
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 md:hidden">
          {isLoading
            ? [...Array(5)].map((_, index) => (
                <div
                  key={`mobile-skeleton-${index}`}
                  className="rounded-2xl border border-border/60 bg-card/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <Skeleton className="mt-4 h-10 w-full rounded-xl" />
                </div>
              ))
            : coins.map((coin) => (
                <MobileCoinCard key={`mobile-${coin.id}`} coin={coin} currency={currency} />
              ))}
        </div>
      </div>
    </div>
  );
}
