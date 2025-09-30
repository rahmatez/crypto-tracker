"use client";

import Image from 'next/image';
import { ArrowUpDown, RefreshCcw } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { MarketCoin } from '@/lib/types';
import type { Currency } from '@/lib/storage';
import { formatCurrency, formatPercent, compactNumber, trendClass } from '@/lib/format';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sparkline } from './sparkline';
import { WatchToggle } from './watch-toggle';
import type { SortDirection, SortKey } from '@/lib/useMarkets';
import { Skeleton } from './ui/skeleton';

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
  return (
    <section className="rounded-2xl border border-border bg-card/80 backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Markets</h2>
          <p className="text-sm text-muted-foreground">
            Track the top cryptocurrencies and spot emerging trends.
          </p>
        </div>
        <div className="flex w-full flex-1 items-center gap-2 sm:w-auto sm:justify-end">
          <div className="w-full max-w-xs">
            <Input
              value={searchTerm}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onSearchTermChange(event.target.value)
              }
              placeholder="Search by name or symbol"
              aria-label="Search coins"
            />
          </div>
          <Button variant="outline" size="icon" onClick={onRefresh} type="button" aria-label="Refresh markets">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border/80">
          <thead className="bg-muted/40">
            <tr>
              {headers.map(({ label, key, align }) => (
                <th
                  key={label}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {key ? (
                    <button
                      className="inline-flex items-center gap-1"
                      onClick={() => onSortChange(key)}
                      type="button"
                    >
                      <span>{label}</span>
                      <ArrowUpDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          sortKey === key
                            ? sortDirection === 'asc'
                              ? 'text-primary rotate-180'
                              : 'text-primary'
                            : 'text-muted-foreground'
                        }`}
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
            {isLoading ? (
              [...Array(10)].map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-6" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="mb-2 h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="ml-auto h-4 w-12" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="ml-auto h-4 w-12" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="ml-auto h-4 w-12" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="h-12 w-28" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </td>
                </tr>
              ))
            ) : coins.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No coins match your filters.
                </td>
              </tr>
            ) : (
              coins.map((coin) => (
                <tr key={coin.id} className="hover:bg-muted/30">
                  <td className="px-4 py-4 text-sm font-semibold text-muted-foreground">
                    {coin.market_cap_rank}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={40}
                        height={40}
                        className="rounded-full border border-border/60 bg-background"
                      />
                      <div>
                        <p className="font-semibold">{coin.name}</p>
                        <p className="text-xs uppercase text-muted-foreground">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    {formatCurrency(coin.current_price, currency)}
                  </td>
                  <td className={`px-4 py-4 text-right text-sm ${trendClass(coin.price_change_percentage_1h_in_currency)}`}>
                    {formatPercent(coin.price_change_percentage_1h_in_currency)}
                  </td>
                  <td className={`px-4 py-4 text-right text-sm ${trendClass(coin.price_change_percentage_24h_in_currency)}`}>
                    {formatPercent(coin.price_change_percentage_24h_in_currency)}
                  </td>
                  <td className={`px-4 py-4 text-right text-sm ${trendClass(coin.price_change_percentage_7d_in_currency)}`}>
                    {formatPercent(coin.price_change_percentage_7d_in_currency)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm">
                    {compactNumber(coin.market_cap, currency)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm">
                    {compactNumber(coin.total_volume, currency)}
                  </td>
                  <td className="px-4 py-4">
                    <Sparkline data={coin.sparkline_in_7d.price} />
                  </td>
                  <td className="px-4 py-4">
                    <WatchToggle coinId={coin.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
