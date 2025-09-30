import type { Currency } from '@/lib/storage';
import type { GlobalStats } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/format';
import { Activity, BarChart3, Globe2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface GlobalOverviewProps {
  stats: GlobalStats;
  currency: Currency;
}

export function GlobalOverview({ stats, currency }: GlobalOverviewProps) {
  const marketCap = stats.total_market_cap[currency] ?? 0;
  const totalVolume = stats.total_volume[currency] ?? 0;
  const btcDominance = stats.market_cap_percentage['btc'] ?? 0;
  const volumeToCap = marketCap ? (totalVolume / marketCap) * 100 : 0;

  const cards = [
    {
      title: 'Total Market Cap',
      description: formatCurrency(marketCap, currency),
      icon: Globe2,
      footer: `${currency.toUpperCase()} market size`
    },
    {
      title: '24h Trading Volume',
      description: formatCurrency(totalVolume, currency),
      icon: Activity,
      footer: `${formatPercent(volumeToCap)} of market cap`
    },
    {
      title: 'BTC Dominance',
      description: `${btcDominance.toFixed(2)}%`,
      icon: BarChart3,
      footer: 'Share of total crypto market'
    }
  ];

  return (
    <div className="dashboard-grid">
      {cards.map(({ title, description, icon: Icon, footer }) => (
        <Card key={title} variant="glass" interactive className="border-border/40 bg-background/40">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{footer}</CardDescription>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
