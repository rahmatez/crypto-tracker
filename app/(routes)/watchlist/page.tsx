import { Suspense } from 'react';
import { WatchlistClient } from '@/components/routes/watchlist-client';
import { Skeleton } from '@/components/ui/skeleton';

function WatchlistSkeleton() {
  return <Skeleton className="h-80 w-full rounded-2xl" />;
}

export default function WatchlistPage() {
  return (
    <Suspense fallback={<WatchlistSkeleton />}>
      <WatchlistClient />
    </Suspense>
  );
}
