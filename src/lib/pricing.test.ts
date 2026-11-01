import { describe, expect, it } from 'vitest';
import { buildPrice, buildPricing } from '@/test/factories';
import {
  formatPrice,
  formatPriceLabel,
  priceForProduct,
} from '@/lib/pricing';

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

  it('omits an interval suffix for one-off credit packs', () => {
    expect(
      formatPrice(
        buildPrice({
          unitAmount: 1400,
          currency: 'gbp',
          interval: null,
        }),
      ),
    ).toBe('£14');
  });

  it('returns null for missing prices or invalid currency', () => {
    expect(formatPriceLabel(null)).toBeNull();
    expect(
      formatPriceLabel(
        buildPrice({
          currency: 'not-a-currency',
        }),
      ),
    ).toBeNull();
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
