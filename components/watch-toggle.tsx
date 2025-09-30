"use client";

import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { useWatchlist } from './providers/preferences-context';
import { cn } from '@/lib/utils';

interface WatchToggleProps {
  coinId: string;
}

export function WatchToggle({ coinId }: WatchToggleProps) {
  const { contains, toggle } = useWatchlist();
  const isWatched = contains(coinId);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'text-muted-foreground hover:text-primary',
        isWatched && 'text-yellow-500 hover:text-yellow-400'
      )}
      onClick={() => toggle(coinId)}
      aria-pressed={isWatched}
      aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
      type="button"
    >
      <Star className={cn('h-5 w-5', isWatched && 'fill-current')} />
    </Button>
  );
}
