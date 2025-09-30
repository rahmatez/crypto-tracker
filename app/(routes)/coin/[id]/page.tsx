import { Suspense } from 'react';
import { CoinClient } from '@/components/routes/coin-client';
import { Skeleton } from '@/components/ui/skeleton';

interface CoinPageProps {
  params: { id: string };
}

function CoinDetailSkeleton() {
  return <Skeleton className="h-96 w-full rounded-2xl" />;
}

export default function CoinPage({ params }: CoinPageProps) {
  return (
    <Suspense fallback={<CoinDetailSkeleton />}>
      <CoinClient coinId={params.id} />
    </Suspense>
  );
}
