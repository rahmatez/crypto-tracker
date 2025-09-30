import { NextResponse } from 'next/server';

const API_BASE = 'https://api.coingecko.com/api/v3';

export const revalidate = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const vs = searchParams.get('vs') ?? 'usd';
  const days = searchParams.get('days') ?? '7';

  if (!id) {
    return NextResponse.json({ message: 'Missing coin id' }, { status: 400 });
  }

  const detailUrl = `${API_BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  const interval = Number(days) <= 1 ? 'hourly' : 'daily';
  const chartUrl = `${API_BASE}/coins/${id}/market_chart?vs_currency=${vs}&days=${days}&interval=${interval}`;

  const fetchOptions: RequestInit & { next: { revalidate: number } } = {
    headers: {
      Accept: 'application/json',
      ...(process.env.CG_API_KEY ? { 'x-cg-demo-api-key': process.env.CG_API_KEY } : {})
    },
    next: { revalidate: 10 }
  };

  const [detailRes, chartRes] = await Promise.all([
    fetch(detailUrl, fetchOptions),
    fetch(chartUrl, fetchOptions)
  ]);

  if (!detailRes.ok || !chartRes.ok) {
    return NextResponse.json(
      { message: 'Failed to fetch coin data' },
      { status: 502, headers: cacheHeaders() }
    );
  }

  const detail = await detailRes.json();
  const chart = await chartRes.json();

  return NextResponse.json({ detail, chart }, { headers: cacheHeaders() });
}

function cacheHeaders() {
  return {
    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
  };
}
