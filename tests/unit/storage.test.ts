import { beforeEach, describe, expect, it } from 'vitest';
import { getWatchlist, setWatchlist, toggleWatch, getCurrency, setCurrency } from '@/lib/storage';

describe('storage utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('toggles coins in watchlist', () => {
    expect(getWatchlist()).toEqual([]);
    toggleWatch('bitcoin');
    expect(getWatchlist()).toEqual(['bitcoin']);
    toggleWatch('bitcoin');
    expect(getWatchlist()).toEqual([]);
  });

  it('sets watchlist directly', () => {
    setWatchlist(['bitcoin', 'ethereum']);
    expect(new Set(getWatchlist())).toEqual(new Set(['bitcoin', 'ethereum']));
  });

  it('persists currency preference', () => {
    expect(getCurrency()).toBe('usd');
    setCurrency('idr');
    expect(getCurrency()).toBe('idr');
  });
});
