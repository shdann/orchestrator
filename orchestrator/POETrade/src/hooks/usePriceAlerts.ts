import { useState, useEffect, useCallback } from 'react';
import type { PriceAlert, CurrencyRate, TrackedItem } from '../types/poe';

interface UsePriceAlertsResult {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;
  clearTriggered: () => void;
}

const STORAGE_KEY = 'poePriceAlerts';

export function usePriceAlerts(
  currencies: CurrencyRate[],
  items: TrackedItem[]
): UsePriceAlertsResult {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  // Load alerts from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem(STORAGE_KEY);
    if (savedAlerts) {
      try {
        const parsed = JSON.parse(savedAlerts);
        setAlerts(parsed);
      } catch (e) {
        console.error('Failed to parse saved alerts:', e);
      }
    }
  }, []);

  // Check alerts against current prices
  useEffect(() => {
    const allItems = [
      ...currencies.map(c => ({ id: c.id, chaosValue: c.chaosValue, divineValue: c.divineValue })),
      ...items.map(i => ({ id: i.id, chaosValue: i.chaosValue, divineValue: i.divineValue })),
    ];

    setAlerts(prev => {
      let hasChanges = false;
      const updated = prev.map(alert => {
        if (alert.triggered) return alert;

        const item = allItems.find(i => i.id === alert.itemId);
        if (!item) return alert;

        const value = alert.currency === 'chaos' ? item.chaosValue : item.divineValue;
        const shouldTrigger = alert.condition === 'above' 
          ? value >= alert.threshold 
          : value <= alert.threshold;

        if (shouldTrigger) {
          hasChanges = true;
          return { ...alert, triggered: true };
        }
        return alert;
      });

      if (hasChanges) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, [currencies, items]);

  const addAlert = useCallback((alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `${Date.now()}-${Math.random()}`,
      triggered: false,
      createdAt: Date.now(),
    };
    setAlerts(prev => {
      const updated = [...prev, newAlert];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearTriggered = useCallback(() => {
    setAlerts(prev => {
      const updated = prev.filter(a => !a.triggered);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    alerts,
    addAlert,
    removeAlert,
    clearTriggered,
  };
}
