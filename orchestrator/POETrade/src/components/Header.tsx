import { RefreshCw, Bell, Coins, AlertTriangle } from 'lucide-react';
import type { DataStatus } from '../hooks/usePoeData';

interface HeaderProps {
  status: DataStatus;
  lastUpdated: Date | null;
  league: string;
  triggeredAlerts: number;
  onRefresh: () => void;
  onAlertsClick: () => void;
}

export function Header({ status, lastUpdated, league, triggeredAlerts, onRefresh, onAlertsClick }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Coins className="text-yellow-400" size={24} />
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">POE Trade Monitor</h1>
            <p className="text-xs text-gray-400">{league} League</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            {status === 'loading' && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Updating...
              </span>
            )}
            {status === 'error' && (
              <span className="flex items-center gap-1 text-red-400">
                <AlertTriangle size={12} /> Error
              </span>
            )}
            {status === 'success' && lastUpdated && (
              <span className="text-green-400">
                Updated {formatTime(lastUpdated)}
              </span>
            )}
          </div>

          {/* Alerts button */}
          <button
            onClick={onAlertsClick}
            className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
            title="Manage Alerts"
          >
            <Bell size={18} />
            {triggeredAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                {triggeredAlerts}
              </span>
            )}
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={status === 'loading'}
            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-black font-semibold text-sm transition-colors"
          >
            <RefreshCw size={14} className={status === 'loading' ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
