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

export const USER_TIER = {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE',
} as const satisfies Record<string, UserTier>;

export const CHECKOUT_PRODUCT = {
  STARTER_SUBSCRIPTION: 'starter_subscription',
  PRO_SUBSCRIPTION: 'pro_subscription',
} as const satisfies Record<string, CheckoutProduct>;

export function isFreeTier(tier: UserTier): boolean {
  return tier === USER_TIER.FREE;
}

export function isPaidSubscriptionProduct(
  product: CheckoutProduct,
): product is
  | typeof CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION
  | typeof CHECKOUT_PRODUCT.PRO_SUBSCRIPTION {
  return (
    product === CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION ||
    product === CHECKOUT_PRODUCT.PRO_SUBSCRIPTION
  );
}

export function tierLabel(tier: UserTier): string {
  switch (tier) {
    case USER_TIER.FREE:
      return 'Free';
    case USER_TIER.STARTER:
      return 'Starter';
    case USER_TIER.PRO:
      return 'Pro';
    case USER_TIER.ENTERPRISE:
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
  [USER_TIER.FREE]: 0,
  [USER_TIER.STARTER]: 1,
  [USER_TIER.PRO]: 2,
  [USER_TIER.ENTERPRISE]: 3,
};

export function subscriptionProductForTier(
  tier: UserTier,
): Extract<CheckoutProduct, 'starter_subscription' | 'pro_subscription'> | undefined {
  switch (tier) {
    case USER_TIER.STARTER:
      return CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION;
    case USER_TIER.PRO:
      return CHECKOUT_PRODUCT.PRO_SUBSCRIPTION;
    case USER_TIER.FREE:
    case USER_TIER.ENTERPRISE:
      return undefined;
  }
}

export function isSubscriptionUpgrade(
  currentTier: UserTier,
  product: CheckoutProduct,
): boolean {
  if (product === CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION) {
    return TIER_RANK[USER_TIER.STARTER] > TIER_RANK[currentTier];
  }
  if (product === CHECKOUT_PRODUCT.PRO_SUBSCRIPTION) {
    return TIER_RANK[USER_TIER.PRO] > TIER_RANK[currentTier];
  }
  return false;
}
