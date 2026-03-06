import { useState, useEffect } from 'react';

export interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load alerts from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('poeAlerts');
    if (savedAlerts) {
      try {
        const parsed = JSON.parse(savedAlerts);
        // Filter out alerts older than 1 hour
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        const validAlerts = parsed.filter((alert: Alert) => alert.timestamp > oneHourAgo);
        setAlerts(validAlerts);
      } catch (e) {
        console.error('Failed to parse saved alerts:', e);
      }
    }
  }, []);

  // Save alerts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('poeAlerts', JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = (message: string, type: Alert['type'] = 'info') => {
    const newAlert: Alert = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
    };
    setAlerts((prev) => [...prev, newAlert]);
    return newAlert.id;
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
  };
};
