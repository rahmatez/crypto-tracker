"use client";

import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useCurrencyPreference, useWatchlist } from '@/components/providers/preferences-context';
import type { SortDirection, SortKey } from '@/lib/useMarkets';
import type { MarketCoin } from '@/lib/types';
import { fetcher } from '@/lib/fetcher';
import { ErrorState } from '@/components/error-state';
import { EmptyState } from '@/components/empty-state';
import { MarketsTable } from '@/components/markets-table';

function sortCoins(coins: MarketCoin[], key: SortKey, direction: SortDirection) {
  const modifier = direction === 'asc' ? 1 : -1;
  return [...coins].sort((a, b) => {
    switch (key) {
      case 'change_24h':
        return modifier * ((a.price_change_percentage_24h_in_currency ?? 0) - (b.price_change_percentage_24h_in_currency ?? 0));
      case 'change_7d':
        return modifier * ((a.price_change_percentage_7d_in_currency ?? 0) - (b.price_change_percentage_7d_in_currency ?? 0));
      case 'price':
        return modifier * (a.current_price - b.current_price);
      case 'market_cap':
      default:
        return modifier * (a.market_cap - b.market_cap);
    }
  });
}

export function WatchlistClient() {
  const { currency } = useCurrencyPreference();
  const { watchlist } = useWatchlist();
  const [sortKey, setSortKey] = useState<SortKey>('market_cap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const ids = useMemo(() => Array.from(watchlist), [watchlist]);

  const { data, error, isLoading, mutate } = useSWR<MarketCoin[]>(
    ids.length ? `/api/markets?vs=${currency}&ids=${ids.join(',')}` : null,
    fetcher,
    {
      refreshInterval: 20000,
      revalidateOnFocus: false
    }
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = searchTerm.toLowerCase();
    const coins = term
      ? data.filter(
          (coin: MarketCoin) =>
            coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term)
        )
      : data;
    return sortCoins(coins, sortKey, sortDirection);
  }, [data, searchTerm, sortDirection, sortKey]);

  const handleSortChange = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDirection((prev: SortDirection) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDirection('desc');
      }
    },
    [sortKey]
  );

  if (ids.length === 0) {
    return (
      <EmptyState
        title="Your watchlist is empty"
        description="Track coins you care about by starring them anywhere in the app."
        actionLabel="Browse markets"
        actionHref="/"
      />
    );
  }

  if (error) {
    return <ErrorState message="Unable to load your watchlist." onRetry={() => mutate()} />;
  }

  return (
    <div className="space-y-10">
      <section className="section-container">
        <header className="section-header">
          <div>
            <h1 className="typography-h1">Watchlist</h1>
            <p className="section-description">
              Your personalized list of assets, saved locally to your device.
            </p>
          </div>
        </header>
      </section>
      <MarketsTable
        coins={filtered}
        currency={currency}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        isLoading={isLoading}
        onRefresh={() => mutate()}
      />
    </div>
  );
}
