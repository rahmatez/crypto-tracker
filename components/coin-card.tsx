import Image from 'next/image';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MarketCoin } from '@/lib/types';
import { Badge } from './ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { Currency } from '@/lib/storage';

interface CoinCardProps {
  coin: MarketCoin;
  currency: Currency;
}

export function CoinCard({ coin, currency }: CoinCardProps) {
  const change = coin.price_change_percentage_24h_in_currency ?? 0;
  const isPositive = change >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={coin.image}
              alt={coin.name}
              width={40}
              height={40}
              className="rounded-full border border-border/80 bg-background"
            />
            <div>
              <CardTitle>{coin.name}</CardTitle>
              <CardDescription className="uppercase text-xs tracking-wide text-muted-foreground">
                {coin.symbol}
              </CardDescription>
            </div>
          </div>
          <Badge variant={isPositive ? 'success' : 'danger'} className="gap-1">
            <Icon className="h-3.5 w-3.5" /> {formatPercent(change)}
          </Badge>
        </CardHeader>
        <div className="space-y-2 px-6 pb-6">
          <p className="text-sm text-muted-foreground">Current price</p>
          <p className="text-2xl font-semibold">{formatCurrency(coin.current_price, currency)}</p>
        </div>
      </Card>
    </motion.div>
  );
}
