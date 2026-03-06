import { useState } from 'react';
import { RefreshCw, Bell, Coins, AlertTriangle, ChevronDown } from 'lucide-react';
import type { DataStatus } from '../hooks/usePoeData';

interface HeaderProps {
  status: DataStatus;
  lastUpdated: Date | null;
  league: string;
  triggeredAlerts: number;
  onRefresh: () => void;
  onAlertsClick: () => void;
  onLeagueChange: (league: string) => void;
}

const AVAILABLE_LEAGUES = ['3.27', '3.28'];

export function Header({ status, lastUpdated, league, triggeredAlerts, onRefresh, onAlertsClick, onLeagueChange }: HeaderProps) {
  const [showLeagueDropdown, setShowLeagueDropdown] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Coins className="text-yellow-400" size={24} />
          <div className="relative">
            <button
              onClick={() => setShowLeagueDropdown(!showLeagueDropdown)}
              className="flex items-center gap-1"
            >
              <h1 className="text-xl font-bold text-white leading-tight">POE Trade Monitor</h1>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowLeagueDropdown(!showLeagueDropdown)}
                className="text-xs text-gray-400 hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                {league} League
                <ChevronDown size={12} className={`transition-transform ${showLeagueDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* League dropdown */}
            {showLeagueDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLeagueDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[100px]">
                  {AVAILABLE_LEAGUES.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        onLeagueChange(l);
                        setShowLeagueDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-sm text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        l === league
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </>
            )}
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
