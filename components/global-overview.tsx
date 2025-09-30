import type { Currency } from '@/lib/storage';
import type { GlobalStats } from '@/lib/types';
import { formatCurrency } from '@/lib/format';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface GlobalOverviewProps {
  stats: GlobalStats;
  currency: Currency;
}

export function GlobalOverview({ stats, currency }: GlobalOverviewProps) {
  const marketCap = stats.total_market_cap[currency] ?? 0;
  const totalVolume = stats.total_volume[currency] ?? 0;
  const btcDominance = stats.market_cap_percentage['btc'] ?? 0;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Total Market Cap</CardTitle>
          <CardDescription className="text-xl font-semibold">
            {formatCurrency(marketCap, currency)}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>24h Volume</CardTitle>
          <CardDescription className="text-xl font-semibold">
            {formatCurrency(totalVolume, currency)}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>BTC Dominance</CardTitle>
          <CardDescription className="text-xl font-semibold">
            {btcDominance.toFixed(2)}%
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
