import { useState, useEffect } from 'react';
import type { PriceAlert, CurrencyRate, TrackedItem } from '../types/poe';

const STORAGE_KEY = 'poe-trade-alerts';

export function useAlerts(currencies: CurrencyRate[], items: TrackedItem[]) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch { /* ignore */ }
  }, [alerts]);

  // Check alert triggers when data updates
  useEffect(() => {
    if (!currencies.length && !items.length) return;

    setAlerts(prev => prev.map(alert => {
      const currency = currencies.find(c => c.id === alert.itemId);
      const item = items.find(i => i.id === alert.itemId);
      const currentValue = currency
        ? (alert.currency === 'chaos' ? currency.chaosValue : currency.divineValue)
        : item
          ? (alert.currency === 'chaos' ? item.chaosValue : item.divineValue)
          : null;

      if (currentValue === null) return alert;

      const triggered =
        (alert.condition === 'above' && currentValue > alert.threshold) ||
        (alert.condition === 'below' && currentValue < alert.threshold);

      return { ...alert, triggered };
    }));
  }, [currencies, items]);

  const addAlert = (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      triggered: false,
      createdAt: Date.now(),
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const clearTriggered = () => {
    setAlerts(prev => prev.map(a => ({ ...a, triggered: false })));
  };

  return { alerts, addAlert, removeAlert, clearTriggered };
}
