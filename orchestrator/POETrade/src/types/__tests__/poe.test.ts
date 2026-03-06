import { CurrencyRate, TrackedItem, TradeOpportunity, PriceAlert, LeagueInfo } from '../poe';

describe('POE Types', () => {
  describe('CurrencyRate', () => {
    it('should create a valid CurrencyRate', () => {
      const currency: CurrencyRate = {
        id: 'chaos-orb',
        name: 'Chaos Orb',
        shortName: 'Chaos',
        chaosValue: 1.0,
        divineValue: 0.0067,
        change24h: 2.5,
        tradeType: 'currency',
        iconUrl: '/chaos.png',
      };

      expect(currency.id).toBe('chaos-orb');
      expect(currency.name).toBe('Chaos Orb');
      expect(currency.shortName).toBe('Chaos');
      expect(currency.chaosValue).toBe(1.0);
      expect(currency.divineValue).toBe(0.0067);
      expect(currency.change24h).toBe(2.5);
      expect(currency.tradeType).toBe('currency');
      expect(currency.iconUrl).toBe('/chaos.png');
    });

    it('should handle negative change values', () => {
      const currency: CurrencyRate = {
        id: 'divine-orb',
        name: 'Divine Orb',
        shortName: 'Div',
        chaosValue: 150.5,
        divineValue: 1.0,
        change24h: -3.2,
        tradeType: 'currency',
        iconUrl: '/divine.png',
      };

      expect(currency.change24h).toBeLessThan(0);
    });

    it('should handle different trade types', () => {
      const currency: CurrencyRate = {
        id: 'exalted-shard',
        name: 'Exalted Shard',
        shortName: 'Shard',
        chaosValue: 0.125,
        divineValue: 0.0008,
        change24h: 0.0,
        tradeType: 'fragment',
        iconUrl: '/shard.png',
      };

      expect(currency.tradeType).toBe('fragment');
    });
  });

  describe('TrackedItem', () => {
    it('should create a valid TrackedItem', () => {
      const item: TrackedItem = {
        id: 'item-123',
        name: 'Headhunter Leather Belt',
        category: 'Leather Belt',
        chaosValue: 85,
        divineValue: 0.57,
        change24h: 12.3,
        listingCount: 42,
      };

      expect(item.id).toBe('item-123');
      expect(item.name).toBe('Headhunter Leather Belt');
      expect(item.category).toBe('Leather Belt');
      expect(item.chaosValue).toBe(85);
      expect(item.divineValue).toBe(0.57);
      expect(item.change24h).toBe(12.3);
      expect(item.listingCount).toBe(42);
    });

    it('should handle items with links', () => {
      const item: TrackedItem = {
        id: 'item-2',
        name: 'Mirror of Kalandra',
        category: 'Currency',
        chaosValue: 500,
        divineValue: 3.33,
        change24h: 0.0,
        listingCount: 3,
        links: 1000,
      };

      expect(item.links).toBe(1000);
    });
  });

  describe('TradeOpportunity', () => {
    it('should create a valid TradeOpportunity', () => {
      const opportunity: TradeOpportunity = {
        id: 'opp-123',
        name: 'Arb: Divine to Chaos',
        buyFor: { currency: 'Divine Orb', amount: 1 },
        sellFor: { currency: 'Chaos Orb', amount: 150 },
        profitChaos: 10,
        profitPercent: 7.0,
        confidence: 'high',
        category: 'currency',
      };

      expect(opportunity.id).toBe('opp-123');
      expect(opportunity.name).toBe('Arb: Divine to Chaos');
      expect(opportunity.buyFor).toEqual({ currency: 'Divine Orb', amount: 1 });
      expect(opportunity.sellFor).toEqual({ currency: 'Chaos Orb', amount: 150 });
      expect(opportunity.profitChaos).toBe(10);
      expect(opportunity.profitPercent).toBe(7.0);
      expect(opportunity.confidence).toBe('high');
      expect(opportunity.category).toBe('currency');
    });

    it('should calculate profit correctly', () => {
      const opportunity: TradeOpportunity = {
        id: 'opp-456',
        name: 'Test Opportunity',
        buyFor: { currency: 'Chaos Orb', amount: 100 },
        sellFor: { currency: 'Chaos Orb', amount: 120 },
        profitChaos: 20,
        profitPercent: 20,
        confidence: 'medium',
        category: 'items',
      };

      expect(opportunity.profitChaos).toBe(opportunity.sellFor.amount - opportunity.buyFor.amount);
      expect(opportunity.profitPercent).toBe(
        ((opportunity.sellFor.amount - opportunity.buyFor.amount) / opportunity.buyFor.amount) * 100
      );
    });
  });

  describe('PriceAlert', () => {
    it('should create a valid PriceAlert', () => {
      const alert: PriceAlert = {
        id: 'alert-1',
        itemName: 'Headhunter',
        itemId: 'item-123',
        condition: 'above',
        threshold: 80,
        currency: 'divine',
        triggered: false,
        createdAt: Date.now(),
      };

      expect(alert.id).toBe('alert-1');
      expect(alert.itemName).toBe('Headhunter');
      expect(alert.itemId).toBe('item-123');
      expect(alert.condition).toBe('above');
      expect(alert.threshold).toBe(80);
      expect(alert.currency).toBe('divine');
      expect(alert.triggered).toBe(false);
      expect(alert.createdAt).toBeLessThanOrEqual(Date.now());
    });

    it('should handle triggered alerts', () => {
      const alert: PriceAlert = {
        id: 'alert-2',
        itemName: 'Mirror of Kalandra',
        itemId: 'item-456',
        condition: 'below',
        threshold: 400,
        currency: 'chaos',
        triggered: true,
        createdAt: Date.now(),
      };

      expect(alert.triggered).toBe(true);
      expect(alert.condition).toBe('below');
    });
  });

  describe('LeagueInfo', () => {
    it('should create a valid LeagueInfo', () => {
      const league: LeagueInfo = {
        id: 'standard',
        text: 'Standard',
      };

      expect(league.id).toBe('standard');
      expect(league.text).toBe('Standard');
    });
  });
});
