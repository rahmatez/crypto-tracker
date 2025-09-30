import useSWR from 'swr';
import { fetcher } from './fetcher';
import type { Currency } from './storage';
import type { CoinChart, CoinDetail } from './types';

export type ChartRange = '1' | '7' | '30';

export type CoinResponse = {
  detail: CoinDetail;
  chart: CoinChart;
};

export function useCoin(id: string, currency: Currency, range: ChartRange = '7') {
  const { data, error, isLoading, mutate } = useSWR<CoinResponse>(
    () => `/api/coin?id=${id}&vs=${currency}&days=${range}`,
    fetcher,
    {
      refreshInterval: 15000,
      revalidateOnFocus: false
    }
  );

  return {
    detail: data?.detail,
    chart: data?.chart,
    isLoading,
    isError: Boolean(error),
    mutate
  };
}
