import { describe, expect, it } from 'vitest';
import {
  CHECKOUT_PRODUCT,
  formatCreditCostLabel,
  isFreeTier,
  isLowAnalysisBalance,
  isPaidPlanSwitch,
  isPaidSubscriptionChange,
  isSubscriptionDowngrade,
  perCreditValueLabel,
  remainingAnalysesBadgeLabel,
  remainingAnalysesLabel,
  subscriptionProductForTier,
  USER_TIER,
  tierLabel,
} from '@/lib/plans';

describe('plan copy helpers', () => {
  it('formats credit costs for analysis and layout', () => {
    expect(formatCreditCostLabel(1, 'analysis')).toBe('1 analysis per listing');
    expect(formatCreditCostLabel(3, 'layout')).toBe('3 analyses per layout');
  });

  it('labels remaining analyses and flags a low balance', () => {
    expect(remainingAnalysesBadgeLabel(12)).toBe('12 analyses');
    expect(remainingAnalysesBadgeLabel(1)).toBe('1 analysis');
    expect(remainingAnalysesBadgeLabel(0)).toBe('No analyses left');
    expect(remainingAnalysesLabel(4)).toBe('4 analyses left');
    expect(remainingAnalysesLabel(4, 'remaining')).toBe('4 analyses remaining');
    expect(isLowAnalysisBalance(2)).toBe(true);
    expect(isLowAnalysisBalance(3)).toBe(false);
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

  it('treats Starter as a downgrade from Pro', () => {
    expect(
      isSubscriptionDowngrade(USER_TIER.PRO, CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION),
    ).toBe(true);
    expect(
      isSubscriptionDowngrade(USER_TIER.STARTER, CHECKOUT_PRODUCT.PRO_SUBSCRIPTION),
    ).toBe(false);
    expect(
      isSubscriptionDowngrade(USER_TIER.PRO, 'credits_5'),
    ).toBe(false);
  });

  it('confirms only when switching between paid plans', () => {
    expect(
      isPaidPlanSwitch(USER_TIER.STARTER, CHECKOUT_PRODUCT.PRO_SUBSCRIPTION),
    ).toBe(true);
    expect(
      isPaidPlanSwitch(USER_TIER.PRO, CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION),
    ).toBe(true);
    expect(
      isPaidPlanSwitch(USER_TIER.FREE, CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION),
    ).toBe(false);
    expect(isPaidPlanSwitch(USER_TIER.PRO, 'credits_5')).toBe(false);
  });

  it('keeps only the per-analysis rate on pack value labels', () => {
    expect(perCreditValueLabel('£2.80 per analysis')).toBe(
      '£2.80 per analysis',
    );
    expect(
      perCreditValueLabel(
        '£2.33 per analysis · 17% less than the 5-analysis pack',
      ),
    ).toBe('£2.33 per analysis');
  });
});
