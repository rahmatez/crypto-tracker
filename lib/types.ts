import type { Currency } from './storage';

export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  sparkline_in_7d: {
    price: number[];
  };
};

export type GlobalStats = {
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
};

export type CoinDetail = {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  market_data: {
    current_price: Record<Currency, number>;
    price_change_percentage_24h: number;
    high_24h: Record<Currency, number>;
    low_24h: Record<Currency, number>;
    market_cap: Record<Currency, number>;
    circulating_supply: number;
    total_supply: number | null;
  };
  description: {
    en: string;
    id?: string;
  };
};

export type CoinChartPoint = [number, number];

export type CoinChart = {
  prices: CoinChartPoint[];
};
