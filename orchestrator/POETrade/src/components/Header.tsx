import { RefreshCw, Bell } from 'lucide-react';
import type { DataStatus } from '../hooks/usePoeData';

interface HeaderProps {
  status: DataStatus;
  lastUpdated: Date | null;
  league: string;
  triggeredAlerts: number;
  onRefresh: () => void;
  onAlertsClick: () => void;
}

export function Header({
  status,
  lastUpdated,
  league,
  triggeredAlerts,
  onRefresh,
  onAlertsClick,
}: HeaderProps) {
  const isLoading = status === 'loading';
  const lastUpdatedText = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString()
    : 'Never';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">POETrade</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="text-yellow-400">{league}</span>
              <span className="mx-2">•</span>
              Updated: {lastUpdatedText}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAlertsClick}
              className="relative p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              aria-label="View alerts"
            >
              <Bell size={20} />
              {triggeredAlerts > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {triggeredAlerts}
                </span>
              )}
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh data"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
