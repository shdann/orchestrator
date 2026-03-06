import type { TrackedItem } from '../types/poe';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ItemPriceTableProps {
  items: TrackedItem[];
}

export function ItemPriceTable({ items }: ItemPriceTableProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
        <p className="text-gray-400">No items to display</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-900/50">
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Item</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Category</th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gray-300">Chaos</th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gray-300">Divine</th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gray-300">24h Change</th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gray-300">Listings</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const changeIcon = item.change24h > 0 ? (
              <TrendingUp size={14} className="text-green-400" />
            ) : item.change24h < 0 ? (
              <TrendingDown size={14} className="text-red-400" />
            ) : (
              <Minus size={14} className="text-gray-400" />
            );

            const changeColor = item.change24h > 0 ? 'text-green-400' : item.change24h < 0 ? 'text-red-400' : 'text-gray-400';

            return (
              <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-medium text-white">{item.name}</p>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-400">{item.category}</span>
                </td>
                <td className="py-4 px-4 text-right font-mono text-white">
                  {item.chaosValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </td>
                <td className="py-4 px-4 text-right font-mono text-yellow-400">
                  {item.divineValue > 0 ? item.divineValue.toFixed(4) : '-'}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {changeIcon}
                    <span className={`font-mono text-sm ${changeColor}`}>
                      {item.change24h > 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-mono text-sm text-gray-400">
                  {item.listingCount?.toLocaleString() || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
