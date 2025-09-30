import { describe, expect, it } from 'vitest';
import { compactNumber, formatCurrency, formatPercent, trendClass } from '@/lib/format';

describe('format utilities', () => {
  it('formats currency based on currency code', () => {
    expect(formatCurrency(1234.56, 'usd')).toContain('$');
    expect(formatCurrency(1234.56, 'idr')).toMatch(/Rp/);
  });

  it('returns dash for nullish currency', () => {
    expect(formatCurrency(null, 'usd')).toBe('—');
  });

  it('formats percent with sign', () => {
    expect(formatPercent(2.5)).toBe('+2.50%');
    expect(formatPercent(-1.234)).toBe('-1.23%');
  });

  it('compacts large numbers', () => {
    expect(compactNumber(12_300_000)).toBe('12.3M');
  });

  it('returns trend class', () => {
    expect(trendClass(5)).toBe('text-emerald-500');
    expect(trendClass(-1)).toBe('text-red-500');
    expect(trendClass(0)).toBe('text-muted-foreground');
  });
});
