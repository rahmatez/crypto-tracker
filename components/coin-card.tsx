import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MarketCoin } from '@/lib/types';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { CoinImage } from './coin-image';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { Currency } from '@/lib/storage';
import { WatchToggle } from './watch-toggle';
import { cn } from '@/lib/utils';

interface CoinCardProps {
  coin: MarketCoin;
  currency: Currency;
}

export function CoinCard({ coin, currency }: CoinCardProps) {
  const change = coin.price_change_percentage_24h_in_currency ?? 0;
  const change7d = coin.price_change_percentage_7d_in_currency ?? 0;
  const isPositive = change >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const rank = coin.market_cap_rank ?? undefined;
  const marketCap = coin.market_cap ?? 0;
  const volume = coin.total_volume ?? 0;
  const volumeRatio = marketCap ? (volume / marketCap) * 100 : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Card variant="elevated" interactive className="group overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0" />

        <CardHeader className="relative z-10 mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <CoinImage
                src={coin.image}
                alt={`${coin.name} logo`}
                width={48}
                height={48}
                className="rounded-full border border-border/60 bg-background shadow-sm"
                priority={coin.market_cap_rank <= 10}
              />
              {rank ? (
                <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-semibold text-muted-foreground">
                  #{rank}
                </div>
              ) : null}
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg">{coin.name}</CardTitle>
              <CardDescription className="uppercase tracking-[0.3em] text-xs">
                {coin.symbol}
              </CardDescription>
            </div>
          </div>
          <Badge variant={isPositive ? 'success' : 'danger'} className="gap-1 px-3">
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {formatPercent(change)}
          </Badge>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="typography-small text-muted-foreground">Current Price</p>
              <p className="text-3xl font-semibold tracking-tight">
                {formatCurrency(coin.current_price, currency)}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <TrendIcon className={cn('h-3.5 w-3.5', isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]')} />
              <span>7d {formatPercent(change7d)}</span>
            </div>
          </div>

          <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="mb-1 text-xs uppercase tracking-wider">Market Cap</p>
              <p className="font-semibold text-foreground">{formatCurrency(marketCap, currency)}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="mb-1 text-xs uppercase tracking-wider">24h Volume</p>
              <p className="font-semibold text-foreground">{formatCurrency(volume, currency)}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="mb-1 text-xs uppercase tracking-wider">Volume / Cap</p>
              <span className="font-semibold text-foreground">{formatPercent(volumeRatio)}</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="mb-1 text-xs uppercase tracking-wider">24h Change</p>
              <span
                className={cn(
                  'flex items-center gap-1 font-semibold',
                  isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {formatPercent(change)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative z-10 mt-8 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted/50 px-3 py-1 font-medium">
              Rank {rank ?? '—'}
            </span>
            <span className="rounded-full bg-muted/50 px-3 py-1 font-medium">
              Volume ratio {formatPercent(volumeRatio)}
            </span>
          </div>
          <WatchToggle coinId={coin.id} />
        </CardFooter>
      </Card>
    </motion.article>
  );
}
