const WATCHLIST_KEY = 'ct_watchlist';
const CURRENCY_KEY = 'ct_currency';

type Currency = 'usd' | 'idr';

type WatchlistChangeCallback = (watchlist: string[]) => void;
type CurrencyChangeCallback = (currency: Currency) => void;

const subscribers = new Set<WatchlistChangeCallback>();
const currencySubscribers = new Set<CurrencyChangeCallback>();

const isBrowser = typeof window !== 'undefined';

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to read ${key} from storage`, error);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write ${key} to storage`, error);
  }
}

export function getWatchlist(): string[] {
  return readJson<string[]>(WATCHLIST_KEY, []);
}

export function setWatchlist(ids: string[]) {
  writeJson(WATCHLIST_KEY, ids);
  subscribers.forEach((callback) => callback(ids));
}

export function toggleWatch(id: string): string[] {
  const watchlist = new Set(getWatchlist());
  if (watchlist.has(id)) {
    watchlist.delete(id);
  } else {
    watchlist.add(id);
  }
  const next = Array.from(watchlist);
  setWatchlist(next);
  return next;
}

export function subscribeWatchlist(callback: WatchlistChangeCallback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

export function getCurrency(): Currency {
  return readJson<Currency>(CURRENCY_KEY, 'usd');
}

export function setCurrency(currency: Currency) {
  writeJson(CURRENCY_KEY, currency);
  currencySubscribers.forEach((callback) => callback(currency));
}

export function subscribeCurrency(callback: CurrencyChangeCallback) {
  currencySubscribers.add(callback);
  return () => currencySubscribers.delete(callback);
}

export type { Currency };
