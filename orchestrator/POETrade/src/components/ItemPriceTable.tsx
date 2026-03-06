import { useState } from 'react';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import type { TrackedItem } from '../types/poe';

interface ItemPriceTableProps {
  items: TrackedItem[];
  category?: string;
}

type SortField = 'name' | 'chaosValue' | 'divineValue' | 'change24h' | 'listingCount';
type SortDirection = 'asc' | 'desc';

export function ItemPriceTable({ items, category }: ItemPriceTableProps) {
  const [sortField, setSortField] = useState<SortField>('chaosValue');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const filteredItems = category
    ? items.filter(item => item.category.toLowerCase().includes(category.toLowerCase()))
    : items;

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDir === 'asc' ? 1 : -1;
    return (aVal > bVal ? 1 : aVal < bVal ? -1 : 0) * modifier;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const formatValue = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    if (val >= 100) return val.toFixed(1);
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && (
          <ArrowUpDown size={12} className={sortDir === 'asc' ? 'rotate-180' : ''} />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 bg-gray-850">
        <h2 className="text-lg font-semibold text-white">
          {category || 'All Items'}
          <span className="text-sm font-normal text-gray-400 ml-2">
            ({filteredItems.length} items)
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-850">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <SortHeader field="chaosValue" label="Chaos Value" />
              <SortHeader field="divineValue" label="Divine Value" />
              <SortHeader field="change24h" label="24h %" />
              <SortHeader field="listingCount" label="Listings" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedItems.map(item => {
              const isUp = item.change24h > 0.5;
              const isDown = item.change24h < -0.5;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-750 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      {formatValue(item.chaosValue)} c
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-yellow-400">
                      {formatValue(item.divineValue)} div
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      isUp ? 'bg-green-900/50 text-green-400' :
                      isDown ? 'bg-red-900/50 text-red-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {item.change24h > 0 ? '+' : ''}{item.change24h.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-400">{item.listingCount}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedItems.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500">
          No items found
        </div>
      )}
    </div>
  );
}
