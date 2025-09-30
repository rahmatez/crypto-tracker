import useSWR from 'swr';
import { fetcher } from './fetcher';
import type { Currency } from './storage';
import type { MarketCoin } from './types';

export type SortKey = 'market_cap' | 'price' | 'change_24h' | 'change_7d';
export type SortDirection = 'asc' | 'desc';

export type UseMarketsOptions = {
  currency: Currency;
  perPage?: number;
  page?: number;
  refreshInterval?: number;
  searchTerm?: string;
  sortKey?: SortKey;
  sortDirection?: SortDirection;
};

function sortCoins(
  coins: MarketCoin[],
  sortKey: SortKey,
  direction: SortDirection
): MarketCoin[] {
  const sorted = [...coins];
  sorted.sort((a, b) => {
    let valueA = 0;
    let valueB = 0;

    switch (sortKey) {
      case 'market_cap':
        valueA = a.market_cap;
        valueB = b.market_cap;
        break;
      case 'price':
        valueA = a.current_price;
        valueB = b.current_price;
        break;
      case 'change_24h':
        valueA = a.price_change_percentage_24h_in_currency ?? 0;
        valueB = b.price_change_percentage_24h_in_currency ?? 0;
        break;
      case 'change_7d':
        valueA = a.price_change_percentage_7d_in_currency ?? 0;
        valueB = b.price_change_percentage_7d_in_currency ?? 0;
        break;
    }

    if (direction === 'desc') {
      return valueB - valueA;
    }
    return valueA - valueB;
  });

  return sorted;
}

export function useMarkets({
  currency,
  perPage = 20,
  page = 1,
  refreshInterval = 15000,
  searchTerm,
  sortDirection = 'desc',
  sortKey = 'market_cap'
}: UseMarketsOptions) {
  const { data, error, isLoading, mutate } = useSWR<MarketCoin[]>(
    `/api/markets?vs=${currency}&per_page=${perPage}&page=${page}`,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false
    }
  );

  const filtered = (data ?? []).filter((coin) => {
    if (!searchTerm) return true;
    const needle = searchTerm.toLowerCase();
    return (
      coin.name.toLowerCase().includes(needle) || coin.symbol.toLowerCase().includes(needle)
    );
  });

  const sorted = sortCoins(filtered, sortKey, sortDirection);

  const topGainers = [...(data ?? [])]
    .filter((coin) => coin.price_change_percentage_24h_in_currency !== null)
    .sort((a, b) =>
      (b.price_change_percentage_24h_in_currency ?? 0) -
      (a.price_change_percentage_24h_in_currency ?? 0)
    )
    .slice(0, 3);

  const topLosers = [...(data ?? [])]
    .filter((coin) => coin.price_change_percentage_24h_in_currency !== null)
    .sort((a, b) =>
      (a.price_change_percentage_24h_in_currency ?? 0) -
      (b.price_change_percentage_24h_in_currency ?? 0)
    )
    .slice(0, 3);

  return {
    data,
    coins: sorted,
    topGainers,
    topLosers,
    isLoading,
    isError: Boolean(error),
    mutate
  };
}
