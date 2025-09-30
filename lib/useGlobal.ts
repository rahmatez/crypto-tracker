import useSWR from 'swr';
import { fetcher } from './fetcher';
import type { Currency } from './storage';
import type { GlobalStats } from './types';

export function useGlobal(currency: Currency, refreshInterval = 30000) {
  const { data, error, isLoading } = useSWR<{ data: GlobalStats }>(
    `/api/global?vs=${currency}`,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false
    }
  );

  return {
    data: data?.data,
    isLoading,
    isError: Boolean(error)
  };
}
