import type { Currency } from './storage';

const currencyMap: Record<Currency, { locale: string; currency: string }> = {
  usd: { locale: 'en-US', currency: 'USD' },
  idr: { locale: 'id-ID', currency: 'IDR' }
};

export function formatCurrency(value: number | null | undefined, currency: Currency): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  const { locale, currency: curr } = currencyMap[currency];
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: value < 1 ? 6 : 2
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function compactNumber(value: number | null | undefined, currency?: Currency): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  const options: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 2
  };
  const locale = currency ? currencyMap[currency].locale : 'en-US';
  return new Intl.NumberFormat(locale, options).format(value);
}

export function trendClass(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value) || value === 0) {
    return 'text-muted-foreground';
  }
  return value > 0 ? 'text-emerald-500' : 'text-red-500';
}

export function signColor(value: number | null | undefined): 'positive' | 'negative' | 'neutral' {
  if (value === null || value === undefined || Number.isNaN(value) || value === 0) {
    return 'neutral';
  }
  return value > 0 ? 'positive' : 'negative';
}

export function truncateDescription(html: string, maxLength = 320): string {
  if (!html) return '';
  const doc = globalThis.document?.createElement('div');
  if (!doc) return html;
  doc.innerHTML = html;
  const text = doc.textContent || doc.innerText || '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
