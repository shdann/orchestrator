import { ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import type { TradeOpportunity } from '../types/poe';

interface TradeOpportunitiesProps {
  opportunities: TradeOpportunity[];
  league?: string;
}

export function TradeOpportunities({ opportunities, league = '3.27' }: TradeOpportunitiesProps) {
  if (opportunities.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
        <Clock className="mx-auto text-gray-600 mb-3" size={48} />
        <p className="text-gray-500">No trade opportunities detected yet</p>
        <p className="text-xs text-gray-600 mt-1">Check back after data refreshes</p>
      </div>
    );
  }

  const confidenceColors = {
    high: 'bg-green-900/50 text-green-400 border-green-800',
    medium: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
    low: 'bg-gray-700 text-gray-400 border-gray-600',
  };

  const categoryIcons = {
    'Currency Flip': <TrendingUp size={16} className="text-blue-400" />,
    'Buy Dip': <ArrowUpRight size={16} className="text-green-400" />,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Trade Opportunities
          <span className="text-sm font-normal text-gray-400 ml-2">
            ({opportunities.length} found)
          </span>
        </h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> High
          <span className="w-2 h-2 rounded-full bg-yellow-500 ml-1"></span> Medium
          <span className="w-2 h-2 rounded-full bg-gray-500 ml-1"></span> Low
        </div>
      </div>

      <div className="space-y-3">
        {opportunities.map(opp => (
          <div
            key={opp.id}
            className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-700">
                    {categoryIcons[opp.category as keyof typeof categoryIcons] || (
                      <TrendingUp size={16} className="text-purple-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{opp.name}</p>
                    <p className="text-xs text-gray-500">{opp.category}</p>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                  confidenceColors[opp.confidence]
                }`}>
                  {opp.confidence}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Buy For</p>
                  <p className="text-sm font-medium text-white">
                    {opp.buyFor.amount} {opp.buyFor.currency}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Sell For</p>
                  <p className="text-sm font-medium text-white">
                    {opp.sellFor.amount} {opp.sellFor.currency}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Profit</p>
                    <p className="text-sm font-bold text-green-400">
                      {opp.profitChaos}c
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Margin</p>
                    <p className="text-sm font-bold text-yellow-400">
                      {opp.profitPercent}%
                    </p>
                  </div>
                </div>

                <button
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => {
                    window.open(
                      `https://poe.ninja/economy/${encodeURIComponent(league)}`,
                      '_blank'
                    );
                  }}
                >
                  View on poe.ninja
                  <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
