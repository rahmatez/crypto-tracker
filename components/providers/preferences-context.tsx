"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Currency } from '@/lib/storage';
import {
  getCurrency,
  getWatchlist,
  setCurrency as persistCurrency,
  subscribeCurrency,
  subscribeWatchlist,
  toggleWatch
} from '@/lib/storage';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

interface WatchlistContextValue {
  watchlist: Set<string>;
  toggle: (id: string) => void;
  contains: (id: string) => boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);
const WatchlistContext = createContext<WatchlistContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children?: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('usd');
  const [watchlist, setWatchlistState] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCurrencyState(getCurrency());
    setWatchlistState(new Set(getWatchlist()));

    const unsubCurrency = subscribeCurrency((value) => setCurrencyState(value));
    const unsubWatchlist = subscribeWatchlist((value) => setWatchlistState(new Set(value)));

    return () => {
      unsubCurrency();
      unsubWatchlist();
    };
  }, []);

  const currencyValue = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency: (next: Currency) => {
        setCurrencyState(next);
        persistCurrency(next);
      }
    }),
    [currency]
  );

  const watchlistValue = useMemo<WatchlistContextValue>(
    () => ({
      watchlist,
      toggle: (id: string) => {
        const next = toggleWatch(id);
        setWatchlistState(new Set(next));
      },
      contains: (id: string) => watchlist.has(id)
    }),
    [watchlist]
  );

  return (
    <CurrencyContext.Provider value={currencyValue}>
      <WatchlistContext.Provider value={watchlistValue}>{children}</WatchlistContext.Provider>
    </CurrencyContext.Provider>
  );
}

export function useCurrencyPreference() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencyPreference must be used within PreferencesProvider');
  }
  return context;
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within PreferencesProvider');
  }
  return context;
}
