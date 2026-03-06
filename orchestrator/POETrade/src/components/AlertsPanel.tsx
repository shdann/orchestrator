import { useState } from 'react';
import { Plus, X, Bell, BellOff, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { PriceAlert, CurrencyRate, TrackedItem } from '../types/poe';

interface AlertsPanelProps {
  alerts: PriceAlert[];
  currencies: CurrencyRate[];
  items: TrackedItem[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => void;
  onRemoveAlert: (id: string) => void;
  onClearTriggered: () => void;
  onClose: () => void;
}

export function AlertsPanel({
  alerts,
  currencies,
  items,
  onAddAlert,
  onRemoveAlert,
  onClearTriggered,
  onClose
}: AlertsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [threshold, setThreshold] = useState('');
  const [currency, setCurrency] = useState<'chaos' | 'divine'>('chaos');

  const allItems = [
    ...currencies.map(c => ({ id: c.id, name: c.name, value: c.chaosValue })),
    ...items.map(i => ({ id: i.id, name: i.name, value: i.chaosValue })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !threshold) return;

    onAddAlert({
      itemName: allItems.find(i => i.id === selectedItem)?.name || selectedItem,
      itemId: selectedItem,
      condition,
      threshold: parseFloat(threshold),
      currency,
    });

    setShowForm(false);
    setSelectedItem('');
    setThreshold('');
  };

  const triggeredAlerts = alerts.filter(a => a.triggered);
  const activeAlerts = alerts.filter(a => !a.triggered);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-850">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell size={20} className="text-yellow-400" />
            Price Alerts
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add new alert form */}
          {showForm ? (
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <h3 className="text-sm font-semibold text-white mb-3">Create New Alert</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Item</label>
                  <select
                    value={selectedItem}
                    onChange={e => setSelectedItem(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="">Select an item...</option>
                    {allItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.value.toFixed(2)}c)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Condition</label>
                    <select
                      value={condition}
                      onChange={e => setCondition(e.target.value as 'above' | 'below')}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="above">Above</option>
                      <option value="below">Below</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Currency</label>
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value as 'chaos' | 'divine')}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="chaos">Chaos</option>
                      <option value="divine">Divine</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Threshold</label>
                  <input
                    type="number"
                    step="0.01"
                    value={threshold}
                    onChange={e => setThreshold(e.target.value)}
                    placeholder="Enter threshold..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Create Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              <Plus size={18} />
              Add New Alert
            </button>
          )}

          {/* Triggered alerts */}
          {triggeredAlerts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Bell size={14} className="text-red-400 animate-pulse" />
                  Triggered ({triggeredAlerts.length})
                </h3>
                <button
                  onClick={onClearTriggered}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {triggeredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="bg-red-900/20 border border-red-900/50 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{alert.itemName}</p>
                        <p className="text-xs text-red-400 mt-1">
                          {alert.condition === 'above' ? 'Above' : 'Below'} {alert.threshold} {alert.currency}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveAlert(alert.id)}
                        className="p-1 rounded hover:bg-red-900/50 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active alerts */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <BellOff size={14} className="text-gray-500" />
              Active ({activeAlerts.length})
            </h3>
            {activeAlerts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No active alerts
              </p>
            ) : (
              <div className="space-y-2">
                {activeAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          alert.condition === 'above' ? 'bg-green-900/30' : 'bg-red-900/30'
                        }`}>
                          {alert.condition === 'above' ? (
                            <TrendingUp size={14} className="text-green-400" />
                          ) : (
                            <TrendingDown size={14} className="text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{alert.itemName}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {alert.condition === 'above' ? 'When above' : 'When below'}{' '}
                            <span className="font-semibold text-white">{alert.threshold}</span>{' '}
                            {alert.currency}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveAlert(alert.id)}
                        className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
