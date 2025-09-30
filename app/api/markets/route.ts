import { NextResponse } from 'next/server';

const API_BASE = 'https://api.coingecko.com/api/v3';

export const revalidate = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vs = searchParams.get('vs') ?? 'usd';
  const perPage = searchParams.get('per_page') ?? '20';
  const page = searchParams.get('page') ?? '1';
  const ids = searchParams.get('ids');

  const params = new URLSearchParams({
    vs_currency: vs,
    order: 'market_cap_desc',
    per_page: perPage,
    page,
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d'
  });

  if (ids) {
    params.set('ids', ids);
  }

  const fetchOptions: RequestInit & { next: { revalidate: number } } = {
    headers: {
      Accept: 'application/json',
      ...(process.env.CG_API_KEY ? { 'x-cg-demo-api-key': process.env.CG_API_KEY } : {})
    },
    next: { revalidate: 10 }
  };

  const response = await fetch(`${API_BASE}/coins/markets?${params.toString()}`, fetchOptions);

  if (!response.ok) {
    return NextResponse.json(
      { message: 'Failed to fetch markets from CoinGecko' },
      { status: response.status, headers: corsCacheHeaders() }
    );
  }

  const data = await response.json();

  return NextResponse.json(data, {
    headers: corsCacheHeaders(10, 30)
  });
}

function corsCacheHeaders(sMaxAge = 10, staleWhileRevalidate = 30) {
  return {
    'Cache-Control': `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  };
}
