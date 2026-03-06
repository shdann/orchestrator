import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { CurrencyRate } from '../types/poe';

interface CurrencyCardProps {
  rate: CurrencyRate;
  highlight?: boolean;
}

export function CurrencyCard({ rate, highlight }: CurrencyCardProps) {
  const change = rate.change24h;
  const isUp = change > 0.5;
  const isDown = change < -0.5;

  const formatValue = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    if (val >= 100) return val.toFixed(1);
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  };

  return (
    <div className={`
      rounded-xl p-4 border transition-all duration-200 hover:scale-[1.02]
      ${highlight
        ? 'bg-yellow-900/30 border-yellow-500/50 shadow-lg shadow-yellow-900/20'
        : 'bg-gray-800 border-gray-700 hover:border-gray-600'}
    `}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {rate.iconUrl ? (
            <img
              src={rate.iconUrl}
              alt={rate.name}
              className="w-8 h-8 object-contain"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 font-bold">
              {rate.shortName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 truncate max-w-[120px]">{rate.name}</p>
            <p className="text-lg font-bold text-white">{formatValue(rate.chaosValue)}
              <span className="text-xs font-normal text-gray-400 ml-1">c</span>
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          isUp ? 'bg-green-900/50 text-green-400' :
          isDown ? 'bg-red-900/50 text-red-400' :
          'bg-gray-700 text-gray-400'
        }`}>
          {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : <Minus size={12} />}
          {change > 0 ? '+' : ''}{change.toFixed(1)}%
        </div>
      </div>

      {rate.divineValue > 0 && rate.name !== 'Divine Orb' && (
        <p className="text-xs text-gray-500 mt-1">
          ≈ {formatValue(rate.divineValue)} <span className="text-yellow-500">div</span>
        </p>
      )}
    </div>
  );
}

export function CurrencyCardSkeleton() {
  return (
    <div className="rounded-xl p-4 border border-gray-700 bg-gray-800 animate-pulse">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-700" />
        <div className="flex-1">
          <div className="h-3 bg-gray-700 rounded w-20 mb-2" />
          <div className="h-6 bg-gray-700 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
