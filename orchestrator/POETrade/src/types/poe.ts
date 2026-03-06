export interface CurrencyRate {
  id: string;
  name: string;
  shortName: string;
  chaosValue: number;
  divineValue: number;
  change24h: number;
  tradeType: 'currency' | 'fragment' | 'essence';
  iconUrl: string;
}

export interface TrackedItem {
  id: string;
  name: string;
  category: string;
  chaosValue: number;
  divineValue: number;
  change24h: number;
  listingCount: number;
  links?: number;
}

export interface TradeOpportunity {
  id: string;
  name: string;
  buyFor: { currency: string; amount: number };
  sellFor: { currency: string; amount: number };
  profitChaos: number;
  profitPercent: number;
  confidence: 'high' | 'medium' | 'low';
  category: string;
}

export interface PriceAlert {
  id: string;
  itemName: string;
  itemId: string;
  condition: 'above' | 'below';
  threshold: number;
  currency: 'chaos' | 'divine';
  triggered: boolean;
  createdAt: number;
}

export interface PriceHistoryPoint {
  date: string;
  value: number;
}

export interface LeagueInfo {
  id: string;
  text: string;
}
