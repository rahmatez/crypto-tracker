"use client";

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCurrencyPreference } from '@/components/providers/preferences-context';
import { useMarkets, type SortDirection, type SortKey } from '@/lib/useMarkets';
import { useGlobal } from '@/lib/useGlobal';
import { GlobalOverview } from '@/components/global-overview';
import { Movers } from '@/components/movers';
import { MarketsTable } from '@/components/markets-table';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';

export function HomeClient() {
  const { currency } = useCurrencyPreference();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialSortKey = (searchParams.get('sortKey') as SortKey) || 'market_cap';
  const initialSortDirection = (searchParams.get('sortDirection') as SortDirection) || 'desc';

  const [sortKey, setSortKey] = useState<SortKey>(initialSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  const searchTerm = searchParams.get('query') ?? '';

  const updateSearchParams = useCallback(
    (next: Partial<{ query: string; sortKey: SortKey; sortDirection: SortDirection }>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.query !== undefined) {
        if (next.query) {
          params.set('query', next.query);
        } else {
          params.delete('query');
        }
      }
      if (next.sortKey) {
        params.set('sortKey', next.sortKey);
      } else {
        params.delete('sortKey');
      }
      if (next.sortDirection) {
        params.set('sortDirection', next.sortDirection);
      } else {
        params.delete('sortDirection');
      }
  const queryString = params.toString();
  router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleSortChange = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        const nextDirection: SortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(nextDirection);
        updateSearchParams({ sortDirection: nextDirection, sortKey });
      } else {
        setSortKey(key);
        setSortDirection('desc');
        updateSearchParams({ sortKey: key, sortDirection: 'desc' });
      }
    },
    [sortDirection, sortKey, updateSearchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      updateSearchParams({ query: value });
    },
    [updateSearchParams]
  );

  const { coins, topGainers, topLosers, isLoading, isError, mutate } = useMarkets({
    currency,
    perPage: 50,
    searchTerm,
    sortDirection,
    sortKey
  });

  const { data: globalStats } = useGlobal(currency);

  const hasMovers = useMemo(
    () => topGainers.length > 0 || topLosers.length > 0,
    [topGainers.length, topLosers.length]
  );

  return (
    <div className="space-y-10">
      {globalStats ? (
        <section className="section-container">
          <header className="section-header">
            <div>
              <h1 className="typography-h1">Global Market Snapshot</h1>
              <p className="section-description">
                Overview of the crypto market in {currency.toUpperCase()}.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => mutate()}
              type="button"
              className="hidden sm:inline-flex"
            >
              Refresh data
            </Button>
          </header>
          <GlobalOverview stats={globalStats} currency={currency} />
        </section>
      ) : null}

      {hasMovers ? (
        <section id="movers" className="section-container">
          <Movers gainers={topGainers} losers={topLosers} currency={currency} />
        </section>
      ) : null}

      {isError ? (
        <section className="section-container">
          <ErrorState message="Unable to load market data." onRetry={() => mutate()} />
        </section>
      ) : (
        <MarketsTable
          coins={coins}
          currency={currency}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchChange}
          isLoading={isLoading}
          onRefresh={() => mutate()}
        />
      )}
    </div>
  );
}
