import { useState, useEffect, useCallback, useRef } from 'react';
import type { CurrencyRate, TrackedItem, TradeOpportunity } from '../types/poe';
import { fetchCurrencyRates, fetchTrackedItems, computeTradeOpportunities } from '../api/poe';

export type DataStatus = 'idle' | 'loading' | 'success' | 'error';

interface PoeDataState {
  currencies: CurrencyRate[];
  items: TrackedItem[];
  opportunities: TradeOpportunity[];
  status: DataStatus;
  error: string | null;
  lastUpdated: Date | null;
  league: string;
  setLeague: (league: string) => void;
  refresh: () => void;
}

const REFRESH_INTERVAL_MS = 60_000; // 60 seconds

export function usePoeData(initialLeague = 'Mercenaries'): PoeDataState {
  const [league, setLeague] = useState(initialLeague);
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
  const [status, setStatus] = useState<DataStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const [currencyData, itemData] = await Promise.all([
        fetchCurrencyRates(league),
        fetchTrackedItems(league),
      ]);
      const opps = computeTradeOpportunities(currencyData, itemData);
      setCurrencies(currencyData);
      setItems(itemData);
      setOpportunities(opps);
      setLastUpdated(new Date());
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    }
  }, [league]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData]);

  return {
    currencies,
    items,
    opportunities,
    status,
    error,
    lastUpdated,
    league,
    setLeague,
    refresh: fetchData,
  };
}
