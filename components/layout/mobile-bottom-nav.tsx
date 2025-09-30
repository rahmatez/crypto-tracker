"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, DollarSign, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrencyPreference } from '@/components/providers/preferences-context';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/', label: 'Markets', icon: LineChart },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark }
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrencyPreference();

  const handleCurrencyToggle = () => {
    const next = currency === 'usd' ? 'idr' : 'usd';
    setCurrency(next);
  };

  return (
    <nav className="mobile-nav-safe-area fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur md:hidden">
      <div className="container">
        <div className="grid grid-cols-4 gap-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleCurrencyToggle}
            type="button"
            aria-label="Toggle currency"
            className="rounded-2xl border border-border/60 bg-background/80"
          >
            <DollarSign className="h-5 w-5" aria-hidden />
          </Button>

          <ThemeToggle
            variant="ghost"
            size="icon"
            className="rounded-2xl border border-border/60 bg-background/80"
          />
        </div>
      </div>
    </nav>
  );
}
