import type { CheckoutProduct, UserTier } from '@/models';

export interface PlanComparison {
  included: string[];
  missing: string[];
}

export interface PlanSummary {
  title: string;
  priceLabel: string;
  creditsLabel: string;
  description: string;
  comparison?: PlanComparison;
  features?: string[];
  valueLabel?: string;
  savePercent?: number;
  highlight?: boolean;
}

/** Fallback copy when the plans API has not loaded yet. */
export const ANALYSIS_CREDIT_COST = 1;
export const PROPOSED_LAYOUT_CREDIT_COST = 3;

export function tierLabel(tier: UserTier): string {
  switch (tier) {
    case 'FREE':
      return 'Free';
    case 'STARTER':
      return 'Starter';
    case 'PRO':
      return 'Pro';
    case 'ENTERPRISE':
      return 'Enterprise';
  }
}

export function formatCreditCostLabel(
  amount: number,
  noun: 'analysis' | 'layout',
): string {
  const unit = amount === 1 ? 'credit' : 'credits';
  return `${amount} ${unit} per ${noun}`;
}

/** Keep only the per-credit rate; drop catalog comparison copy. */
export function perCreditValueLabel(valueLabel: string): string {
  const separatorIndex = valueLabel.indexOf(' · ');
  return separatorIndex === -1
    ? valueLabel
    : valueLabel.slice(0, separatorIndex);
}

const TIER_RANK: Record<UserTier, number> = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
  ENTERPRISE: 3,
};

export function subscriptionProductForTier(
  tier: UserTier,
): Extract<CheckoutProduct, 'starter_subscription' | 'pro_subscription'> | undefined {
  if (tier === 'STARTER') {
    return 'starter_subscription';
  }
  if (tier === 'PRO') {
    return 'pro_subscription';
  }
  return undefined;
}

export function isSubscriptionUpgrade(
  currentTier: UserTier,
  product: CheckoutProduct,
): boolean {
  if (product === 'starter_subscription') {
    return TIER_RANK.STARTER > TIER_RANK[currentTier];
  }
  if (product === 'pro_subscription') {
    return TIER_RANK.PRO > TIER_RANK[currentTier];
  }
  return false;
}
