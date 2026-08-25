import { describe, expect, it } from 'vitest';
import {
  CHECKOUT_PRODUCT,
  formatCreditCostLabel,
  isFreeTier,
  isPaidSubscriptionChange,
  perCreditValueLabel,
  subscriptionProductForTier,
  USER_TIER,
  tierLabel,
} from '@/lib/plans';

describe('plan copy helpers', () => {
  it('formats credit costs for analysis and layout', () => {
    expect(formatCreditCostLabel(1, 'analysis')).toBe('1 credit per analysis');
    expect(formatCreditCostLabel(3, 'layout')).toBe('3 credits per layout');
  });

  it('labels known tiers', () => {
    expect(tierLabel(USER_TIER.FREE)).toBe('Free');
    expect(tierLabel(USER_TIER.STARTER)).toBe('Starter');
    expect(tierLabel(USER_TIER.PRO)).toBe('Pro');
  });

  it('identifies the free tier without a string literal at the call site', () => {
    expect(isFreeTier(USER_TIER.FREE)).toBe(true);
    expect(isFreeTier(USER_TIER.STARTER)).toBe(false);
  });

  it('allows switching between Starter and Pro', () => {
    expect(
      isPaidSubscriptionChange(USER_TIER.STARTER, CHECKOUT_PRODUCT.PRO_SUBSCRIPTION),
    ).toBe(true);
    expect(
      isPaidSubscriptionChange(USER_TIER.PRO, CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION),
    ).toBe(true);
    expect(
      isPaidSubscriptionChange(USER_TIER.STARTER, CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION),
    ).toBe(false);
    expect(subscriptionProductForTier(USER_TIER.STARTER)).toBe(
      CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION,
    );
  });

  it('keeps only the per-credit rate on pack value labels', () => {
    expect(perCreditValueLabel('£2.80 per credit')).toBe('£2.80 per credit');
    expect(
      perCreditValueLabel(
        '£2.33 per credit · 17% less than the 5-credit pack',
      ),
    ).toBe('£2.33 per credit');
  });
});
