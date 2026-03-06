import { useState } from 'react';
import { LayoutDashboard, Package, TrendingUp, ArrowUpRight, DollarSign, Sparkles } from 'lucide-react';
import { usePoeData } from '../hooks/usePoeData';
import { usePriceAlerts } from '../hooks/usePriceAlerts';
import { Header } from './Header';
import { CurrencyCard, CurrencyCardSkeleton } from './CurrencyCard';
import { ItemPriceTable } from './ItemPriceTable';
import { TradeOpportunities } from './TradeOpportunities';
import { AlertsPanel } from './AlertsPanel';

type Tab = 'dashboard' | 'currencies' | 'items' | 'opportunities';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showAlerts, setShowAlerts] = useState(false);

  const {
    currencies,
    items,
    opportunities,
    status,
    error,
    lastUpdated,
    league,
    refresh,
  } = usePoeData('Mercenaries');

  const { alerts, addAlert, removeAlert, clearTriggered } = usePriceAlerts(currencies, items);
  const triggeredAlerts = alerts.filter(a => a.triggered).length;

  const divineRate = currencies.find(c => c.name === 'Divine Orb')?.chaosValue || 0;
  const topCurrencies = currencies.slice(0, 8);
  const topItems = items.slice(0, 20);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'currencies', label: 'Currencies', icon: DollarSign },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'opportunities', label: 'Opportunities', icon: TrendingUp },
  ];

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Header
          status={status}
          lastUpdated={lastUpdated}
          league={league}
          triggeredAlerts={triggeredAlerts}
          onRefresh={refresh}
          onAlertsClick={() => setShowAlerts(true)}
        />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-8 text-center">
            <p className="text-red-400 text-lg mb-2">Failed to load data</p>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={refresh}
              className="mt-4 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        {showAlerts && (
          <AlertsPanel
            alerts={alerts}
            currencies={currencies}
            items={items}
            onAddAlert={addAlert}
            onRemoveAlert={removeAlert}
            onClearTriggered={clearTriggered}
            onClose={() => setShowAlerts(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header
        status={status}
        lastUpdated={lastUpdated}
        league={league}
        triggeredAlerts={triggeredAlerts}
        onRefresh={refresh}
        onAlertsClick={() => setShowAlerts(true)}
      />

      <nav className="bg-gray-900 border-b border-gray-700 sticky top-[60px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'text-yellow-400 border-yellow-400 bg-yellow-400/10'
                      : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Divine rate banner */}
            {divineRate > 0 && (
              <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-yellow-400" size={24} />
                    <div>
                      <p className="text-sm text-gray-400">Current Divine Rate</p>
                      <p className="text-2xl font-bold text-white">
                        1 Divine = {divineRate.toFixed(1)} Chaos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">1 Chaos</p>
                    <p className="text-lg font-semibold text-yellow-400">
                      {(1 / divineRate).toFixed(4)} Divine
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Top currencies */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">Top Currencies</h2>
                <button
                  onClick={() => setActiveTab('currencies')}
                  className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {status === 'loading' ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <CurrencyCardSkeleton key={i} />
                  ))
                ) : (
                  topCurrencies.map(currency => (
                    <CurrencyCard key={currency.id} rate={currency} />
                  ))
                )}
              </div>
            </div>

            {/* Quick opportunities */}
            {opportunities.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">Top Opportunities</h2>
                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors"
                  >
                    View all
                    <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {opportunities.slice(0, 3).map(opp => (
                    <div
                      key={opp.id}
                      className="bg-gray-800 rounded-xl border border-gray-700 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{opp.name}</p>
                          <p className="text-xs text-gray-500">{opp.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-400">{opp.profitChaos}c</p>
                          <p className="text-xs text-yellow-400">{opp.profitPercent}% margin</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'currencies' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">All Currencies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {status === 'loading' ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <CurrencyCardSkeleton key={i} />
                ))
              ) : (
                currencies.map(currency => (
                  <CurrencyCard key={currency.id} rate={currency} />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Top Items</h2>
            <ItemPriceTable items={topItems} />
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Trade Opportunities</h2>
            <TradeOpportunities opportunities={opportunities} />
          </div>
        )}
      </main>

      {showAlerts && (
        <AlertsPanel
          alerts={alerts}
          currencies={currencies}
          items={items}
          onAddAlert={addAlert}
          onRemoveAlert={removeAlert}
          onClearTriggered={clearTriggered}
          onClose={() => setShowAlerts(false)}
        />
      )}
    </div>
  );
}
