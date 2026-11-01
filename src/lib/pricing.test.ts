import { afterEach, describe, expect, it, vi } from 'vitest';
import { logError } from '@/lib/errors';
import {
  analysisCountFromCreditsLabel,
  formatPerAnalysisValue,
  formatPrice,
  formatPriceLabel,
  FREE_PLAN_PRICE_LABEL,
  liveCopyForPlans,
  majorUnitsForAnalytics,
  priceForProduct,
  savePercentFromUnitPrices,
} from '@/lib/pricing';
import { buildPrice, buildPricing } from '@/test/factories';

vi.mock('@/lib/errors', () => ({
  logError: vi.fn(),
}));

afterEach(() => {
  vi.mocked(logError).mockClear();
});

describe('formatPrice', () => {
  it('formats whole GBP monthly amounts without trailing zeros', () => {
    expect(
      formatPrice(
        buildPrice({
          unitAmount: 3900,
          currency: 'gbp',
          interval: 'month',
        }),
      ),
    ).toBe('£39/month');
  });

  it('keeps fractional amounts and yearly intervals', () => {
    expect(
      formatPrice(
        buildPrice({
          unitAmount: 9950,
          currency: 'gbp',
          interval: 'year',
        }),
      ),
    ).toBe('£99.50/year');
  });

  it('labels the free plan as £0 without a Stripe price', () => {
    expect(FREE_PLAN_PRICE_LABEL).toBe('£0');
  });

  it('labels one-off credit packs as one-time', () => {
    expect(
      formatPrice(
        buildPrice({
          unitAmount: 1400,
          currency: 'gbp',
          interval: null,
        }),
      ),
    ).toBe('£14 one-time');
  });

  it('rejects non-finite or negative amounts', () => {
    expect(() => formatPrice(buildPrice({ unitAmount: Number.NaN }))).toThrow(
      /invalid price amount/i,
    );
    expect(() => formatPrice(buildPrice({ unitAmount: -100 }))).toThrow(
      /invalid price amount/i,
    );
    expect(() =>
      formatPrice(buildPrice({ unitAmount: Number.POSITIVE_INFINITY })),
    ).toThrow(/invalid price amount/i);
  });
});

describe('formatPriceLabel', () => {
  it('returns null for missing prices', () => {
    expect(formatPriceLabel(null)).toBeNull();
    expect(logError).not.toHaveBeenCalled();
  });

  it('falls back and logs malformed amounts instead of rendering NaN', () => {
    expect(formatPriceLabel(buildPrice({ unitAmount: Number.NaN }))).toBeNull();
    expect(formatPriceLabel(buildPrice({ unitAmount: -1 }))).toBeNull();
    expect(
      formatPriceLabel(buildPrice({ currency: 'not-a-currency' })),
    ).toBeNull();
    expect(logError).toHaveBeenCalled();
  });
});

describe('analysis counts and pack economics', () => {
  it('reads the analysis count from catalog credits copy', () => {
    expect(
      analysisCountFromCreditsLabel('20 listing analyses / month'),
    ).toBe(20);
    expect(analysisCountFromCreditsLabel('+5 listing analyses')).toBe(5);
    expect(analysisCountFromCreditsLabel('No monthly allowance')).toBeNull();
  });

  it('formats a live per-analysis value', () => {
    expect(
      formatPerAnalysisValue(
        buildPrice({ unitAmount: 1400, currency: 'gbp', interval: null }),
        5,
      ),
    ).toBe('£2.80 per analysis');
    expect(formatPerAnalysisValue(buildPrice(), 0)).toBeNull();
  });

  it('computes a save percent against a more expensive baseline', () => {
    expect(savePercentFromUnitPrices(2.33, 2.8)).toBe(17);
    expect(savePercentFromUnitPrices(2.8, 2.8)).toBeNull();
    expect(savePercentFromUnitPrices(3, 2.8)).toBeNull();
  });

  it('exposes major units for checkout analytics', () => {
    expect(majorUnitsForAnalytics(buildPrice({ unitAmount: 9900 }))).toBe(99);
    expect(majorUnitsForAnalytics(null)).toBeUndefined();
    expect(
      majorUnitsForAnalytics(buildPrice({ unitAmount: Number.NaN })),
    ).toBeUndefined();
  });
});

describe('priceForProduct', () => {
  const pricing = buildPricing({
    plans: {
      starter: buildPrice({ priceId: 'price_starter' }),
      pro: null,
    },
    creditPacks: [
      {
        credits: 15,
        price: buildPrice({
          priceId: 'price_credits_15',
          unitAmount: 3500,
          interval: null,
        }),
      },
    ],
  });

  it('reads subscription and pack prices, treating gaps as null', () => {
    expect(priceForProduct(pricing, 'starter_subscription')?.priceId).toBe(
      'price_starter',
    );
    expect(priceForProduct(pricing, 'pro_subscription')).toBeNull();
    expect(priceForProduct(pricing, 'credits_15')?.unitAmount).toBe(3500);
    expect(priceForProduct(pricing, 'credits_5')).toBeNull();
  });
});

describe('liveCopyForPlans', () => {
  it('derives price, per-analysis value and save badge from live amounts', () => {
    const copies = liveCopyForPlans(
      buildPricing({
        creditPacks: [
          {
            credits: 5,
            price: buildPrice({
              priceId: 'price_credits_5',
              unitAmount: 1400,
              interval: null,
            }),
          },
          {
            credits: 15,
            price: buildPrice({
              priceId: 'price_credits_15',
              unitAmount: 3500,
              interval: null,
            }),
          },
        ],
      }),
      [
        {
          product: 'credits_5',
          creditsLabel: '+5 listing analyses',
        },
        {
          product: 'credits_15',
          creditsLabel: '+15 listing analyses',
        },
      ],
    );

    expect(copies.get('credits_5')).toEqual({
      priceLabel: '£14 one-time',
      valueLabel: '£2.80 per analysis',
      savePercent: null,
    });
    expect(copies.get('credits_15')).toEqual({
      priceLabel: '£35 one-time',
      valueLabel: '£2.33 per analysis',
      savePercent: 17,
    });
  });

  it('hides value and save when a live price or count is missing', () => {
    const copies = liveCopyForPlans(
      buildPricing({
        plans: {
          starter: null,
          pro: buildPrice({
            priceId: 'price_pro',
            unitAmount: 9900,
            interval: 'month',
          }),
        },
      }),
      [
        { product: 'starter_subscription', creditsLabel: '20 listing analyses / month' },
        { product: 'pro_subscription', creditsLabel: 'Higher volume screening' },
      ],
    );

    expect(copies.get('starter_subscription')).toEqual({
      priceLabel: null,
      valueLabel: null,
      savePercent: null,
    });
    expect(copies.get('pro_subscription')).toEqual({
      priceLabel: '£99/month',
      valueLabel: null,
      savePercent: null,
    });
  });
});
