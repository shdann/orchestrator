import type { CurrencyRate, TrackedItem, TradeOpportunity, LeagueInfo } from '../types/poe';

// POE.ninja API - public, no auth required
const POE_NINJA_BASE = 'https://poe.ninja/api/data';

export async function fetchLeagues(): Promise<LeagueInfo[]> {
  try {
    const res = await fetch('https://poe.ninja/api/data/getindexstate');
    if (!res.ok) throw new Error('Failed to fetch leagues');
    const data = await res.json();
    return data.economyLeagues || [];
  } catch {
    // fallback
    return [{ id: 'Mercenaries', text: 'Mercenaries' }];
  }
}

export async function fetchCurrencyRates(league = 'Mercenaries'): Promise<CurrencyRate[]> {
  const endpoints = [
    `${POE_NINJA_BASE}/currencyoverview?league=${encodeURIComponent(league)}&type=Currency`,
    `${POE_NINJA_BASE}/currencyoverview?league=${encodeURIComponent(league)}&type=Fragment`,
  ];

  const results: CurrencyRate[] = [];

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();

      const currencyDetails: Record<string, { icon: string; tradeId: string }> = {};
      if (data.currencyDetails) {
        for (const d of data.currencyDetails) {
          currencyDetails[d.currencyTypeName] = { icon: d.icon, tradeId: d.tradeId };
        }
      }

      if (data.lines) {
        for (const line of data.lines) {
          const details = currencyDetails[line.currencyTypeName] || {};
          const divValue = line.chaosEquivalent ? line.chaosEquivalent / (data.lines.find((l: { currencyTypeName: string; chaosEquivalent: number }) => l.currencyTypeName === 'Divine Orb')?.chaosEquivalent || 200) : 0;
          results.push({
            id: line.currencyTypeName,
            name: line.currencyTypeName,
            shortName: getShortName(line.currencyTypeName),
            chaosValue: line.chaosEquivalent || 1,
            divineValue: parseFloat(divValue.toFixed(4)),
            change24h: line.receiveSparkLine?.totalChange || 0,
            tradeType: url.includes('Fragment') ? 'fragment' : 'currency',
            iconUrl: details.icon || '',
          });
        }
      }
    } catch {
      // skip failed endpoint
    }
  }

  return results;
}

export async function fetchTrackedItems(league = 'Mercenaries'): Promise<TrackedItem[]> {
  const endpoints = [
    { url: `${POE_NINJA_BASE}/itemoverview?league=${encodeURIComponent(league)}&type=UniqueWeapon`, category: 'Unique Weapon' },
    { url: `${POE_NINJA_BASE}/itemoverview?league=${encodeURIComponent(league)}&type=UniqueArmour`, category: 'Unique Armour' },
    { url: `${POE_NINJA_BASE}/itemoverview?league=${encodeURIComponent(league)}&type=UniqueAccessory`, category: 'Unique Accessory' },
    { url: `${POE_NINJA_BASE}/itemoverview?league=${encodeURIComponent(league)}&type=DivinationCard`, category: 'Divination Card' },
    { url: `${POE_NINJA_BASE}/itemoverview?league=${encodeURIComponent(league)}&type=SkillGem`, category: 'Skill Gem' },
  ];

  const results: TrackedItem[] = [];
  let divineRate = 200; // fallback

  // get divine rate first
  try {
    const currRes = await fetch(`${POE_NINJA_BASE}/currencyoverview?league=${encodeURIComponent(league)}&type=Currency`);
    if (currRes.ok) {
      const currData = await currRes.json();
      const divine = currData.lines?.find((l: { currencyTypeName: string; chaosEquivalent: number }) => l.currencyTypeName === 'Divine Orb');
      if (divine) divineRate = divine.chaosEquivalent;
    }
  } catch { /* use fallback */ }

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.lines) {
        const topItems = data.lines
          .sort((a: { chaosValue: number }, b: { chaosValue: number }) => b.chaosValue - a.chaosValue)
          .slice(0, 20);
        for (const item of topItems) {
          results.push({
            id: `${ep.category}-${item.id || item.name}`,
            name: item.name,
            category: ep.category,
            chaosValue: item.chaosValue || 0,
            divineValue: parseFloat(((item.chaosValue || 0) / divineRate).toFixed(4)),
            change24h: item.sparkline?.totalChange || 0,
            listingCount: item.listingCount || 0,
            links: item.links,
          });
        }
      }
    } catch { /* skip */ }
  }

  return results.sort((a, b) => b.chaosValue - a.chaosValue);
}

export function computeTradeOpportunities(
  currencies: CurrencyRate[],
  items: TrackedItem[]
): TradeOpportunity[] {
  const opps: TradeOpportunity[] = [];
  const divine = currencies.find(c => c.name === 'Divine Orb');
  const divineRate = divine?.chaosValue || 200;

  // Currency flip opportunities (buy low sell high)
  const highValueCurrencies = currencies
    .filter(c => c.chaosValue > 5 && c.change24h > 3)
    .slice(0, 10);

  for (const curr of highValueCurrencies) {
    opps.push({
      id: `flip-${curr.id}`,
      name: `Flip ${curr.name}`,
      buyFor: { currency: 'Chaos Orb', amount: Math.round(curr.chaosValue * 0.95) },
      sellFor: { currency: 'Chaos Orb', amount: Math.round(curr.chaosValue) },
      profitChaos: Math.round(curr.chaosValue * 0.05),
      profitPercent: 5,
      confidence: curr.change24h > 10 ? 'high' : curr.change24h > 5 ? 'medium' : 'low',
      category: 'Currency Flip',
    });
  }

  // High-value items worth tracking
  const highValueItems = items
    .filter(i => i.chaosValue > divineRate && i.change24h < -5)
    .slice(0, 5);

  for (const item of highValueItems) {
    opps.push({
      id: `buy-dip-${item.id}`,
      name: `Buy the Dip: ${item.name}`,
      buyFor: { currency: 'Divine Orb', amount: parseFloat((item.chaosValue / divineRate).toFixed(2)) },
      sellFor: { currency: 'Divine Orb', amount: parseFloat(((item.chaosValue / divineRate) * 1.1).toFixed(2)) },
      profitChaos: Math.round(item.chaosValue * 0.1),
      profitPercent: 10,
      confidence: item.change24h < -10 ? 'high' : 'medium',
      category: 'Buy Dip',
    });
  }

  return opps.sort((a, b) => b.profitChaos - a.profitChaos);
}

function getShortName(name: string): string {
  const map: Record<string, string> = {
    'Chaos Orb': 'c',
    'Divine Orb': 'div',
    'Exalted Orb': 'ex',
    'Mirror of Kalandra': 'mirror',
    'Orb of Alteration': 'alt',
    'Orb of Fusing': 'fuse',
    'Orb of Alchemy': 'alch',
    'Orb of Scouring': 'scour',
    'Orb of Regret': 'regret',
    'Regal Orb': 'regal',
    'Vaal Orb': 'vaal',
    'Blessed Orb': 'blessed',
    'Gemcutter\'s Prism': 'gcp',
    'Cartographer\'s Chisel': 'chisel',
    'Chromatic Orb': 'chrom',
    'Jeweller\'s Orb': 'jew',
    "Orb of Annulment": 'annul',
  };
  return map[name] || name.split(' ').map(w => w[0]).join('').toLowerCase();
}
