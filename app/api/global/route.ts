import { NextResponse } from 'next/server';

const API_BASE = 'https://api.coingecko.com/api/v3';

export const revalidate = 10;

export async function GET() {
  const fetchOptions: RequestInit & { next: { revalidate: number } } = {
    headers: {
      Accept: 'application/json',
      ...(process.env.CG_API_KEY ? { 'x-cg-demo-api-key': process.env.CG_API_KEY } : {})
    },
    next: { revalidate: 30 }
  };

  const response = await fetch(`${API_BASE}/global`, fetchOptions);

  if (!response.ok) {
    return NextResponse.json(
      { message: 'Failed to fetch global stats' },
      { status: response.status, headers: cacheHeaders() }
    );
  }

  const data = await response.json();

  return NextResponse.json(data, {
    headers: cacheHeaders(30, 120)
  });
}

function cacheHeaders(sMaxAge = 30, staleWhileRevalidate = 120) {
  return {
    'Cache-Control': `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  };
}
