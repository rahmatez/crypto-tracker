"use client";

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useCurrencyPreference } from './providers/preferences-context';

const currencies = [
  { label: 'USD', value: 'usd' },
  { label: 'IDR', value: 'idr' }
] as const;

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyPreference();

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-muted p-1">
      {currencies.map(({ label, value }) => {
        const isActive = currency === value;
        return (
          <Button
            key={value}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            className="relative overflow-hidden rounded-full px-4"
            onClick={() => setCurrency(value)}
            type="button"
          >
            {isActive && (
              <motion.span
                layout
                className="absolute inset-0 -z-10 bg-primary/20"
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            )}
            <span className="relative flex items-center gap-1 font-medium">{label}</span>
          </Button>
        );
      })}
    </div>
  );
}
