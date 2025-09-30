"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { useCurrencyPreference } from '@/components/providers/preferences-context';
import { useCoin, type ChartRange } from '@/lib/useCoin';
import { formatCurrency, formatPercent } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WatchToggle } from '@/components/watch-toggle';
import { cn } from '@/lib/utils';

interface CoinClientProps {
  coinId: string;
}

const ranges: Array<{ label: string; value: ChartRange }> = [
  { label: '24H', value: '1' },
  { label: '7D', value: '7' },
  { label: '30D', value: '30' }
];

export function CoinClient({ coinId }: CoinClientProps) {
  const { currency } = useCurrencyPreference();
  const [range, setRange] = useState<ChartRange>('7');
  const { chart, detail, isLoading, isError, mutate } = useCoin(coinId, currency, range);

  const chartData = useMemo(() => {
    if (!chart) return [];
    return chart.prices.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      }),
      price
    }));
  }, [chart]);

  const sanitizedDescription = useMemo(() => {
    if (!detail?.description?.en) return '';
    return DOMPurify.sanitize(detail.description.en, { USE_PROFILES: { html: true } });
  }, [detail?.description?.en]);

  if (isError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
          <p className="font-medium text-destructive">Failed to load coin data.</p>
          <Button className="mt-4" onClick={() => mutate()} type="button">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !detail) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  const priceChange24h = detail.market_data.price_change_percentage_24h;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={detail.image.large}
              alt={detail.name}
              width={56}
              height={56}
              className="rounded-full border border-border/70 bg-background"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold">{detail.name}</h1>
                <span className="rounded-full bg-muted px-3 py-1 text-sm uppercase text-muted-foreground">
                  {detail.symbol}
                </span>
              </div>
              <p className="text-2xl font-semibold">
                {formatCurrency(detail.market_data.current_price[currency], currency)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <WatchToggle coinId={coinId} />
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`https://www.coingecko.com/en/coins/${coinId}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-medium', priceChange24h >= 0 ? 'text-emerald-500' : 'text-red-500')}>
            {formatPercent(priceChange24h)} (24h)
          </span>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/50 p-1">
            {ranges.map(({ label, value }) => (
              <Button
                key={value}
                size="sm"
                variant={range === value ? 'default' : 'ghost'}
                className="rounded-full px-4"
                onClick={() => setRange(value)}
                type="button"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/80 p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderRadius: '0.75rem',
                  border: '1px solid hsl(var(--border))'
                }}
                formatter={(value: number) => formatCurrency(value, currency)}
              />
              <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <h2 className="mb-4 text-lg font-semibold">Market Stats</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">24h High</dt>
              <dd className="font-medium">
                {formatCurrency(detail.market_data.high_24h[currency], currency)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">24h Low</dt>
              <dd className="font-medium">
                {formatCurrency(detail.market_data.low_24h[currency], currency)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Market Cap</dt>
              <dd className="font-medium">
                {formatCurrency(detail.market_data.market_cap[currency], currency)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Circulating Supply</dt>
              <dd className="font-medium">
                {detail.market_data.circulating_supply.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total Supply</dt>
              <dd className="font-medium">
                {detail.market_data.total_supply?.toLocaleString() ?? '—'}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <h2 className="mb-4 text-lg font-semibold">About {detail.name}</h2>
          {sanitizedDescription ? (
            <article
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              This asset currently has no description available.
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            Market data refreshed every 15 seconds through CoinGecko proxy.
          </div>
        </div>
      </div>
    </div>
  );
}
