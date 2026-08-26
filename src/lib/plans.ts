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

/** Remaining analyses at or below this count show as a warning in the header. */
export const LOW_ANALYSIS_BALANCE = 2;

export function analysisCountLabel(amount: number): string {
  const count = Math.max(0, amount);
  return count === 1 ? '1 analysis' : `${count} analyses`;
}

export function formatCreditCostLabel(
  amount: number,
  noun: 'analysis' | 'layout',
): string {
  const unit = analysisCountLabel(amount);
  return noun === 'analysis' ? `${unit} per listing` : `${unit} per layout`;
}

export function remainingAnalysesLabel(
  amount: number,
  wording: 'left' | 'remaining' = 'left',
): string {
  if (amount <= 0) {
    return `No analyses ${wording}`;
  }
  return `${analysisCountLabel(amount)} ${wording}`;
}

export function remainingAnalysesBadgeLabel(amount: number): string {
  if (amount <= 0) {
    return 'No analyses left';
  }
  return analysisCountLabel(amount);
}

export function isLowAnalysisBalance(amount: number): boolean {
  return amount <= LOW_ANALYSIS_BALANCE;
}

/** Keep only the per-analysis rate; drop catalog comparison copy. */
export function perCreditValueLabel(valueLabel: string): string {
  const separatorIndex = valueLabel.indexOf(' · ');
  return separatorIndex === -1
    ? valueLabel
    : valueLabel.slice(0, separatorIndex);
}

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

export function isPaidSubscriptionChange(
  currentTier: UserTier,
  product: CheckoutProduct,
): boolean {
  if (!isPaidSubscriptionProduct(product)) {
    return false;
  }
  return subscriptionProductForTier(currentTier) !== product;
}

/** True when switching between existing paid plans (Starter ↔ Pro). */
export function isPaidPlanSwitch(
  currentTier: UserTier,
  product: CheckoutProduct,
): boolean {
  const currentProduct = subscriptionProductForTier(currentTier);
  return (
    currentProduct != null &&
    isPaidSubscriptionProduct(product) &&
    currentProduct !== product
  );
}

const TIER_RANK: Record<UserTier, number> = {
  [USER_TIER.FREE]: 0,
  [USER_TIER.STARTER]: 1,
  [USER_TIER.PRO]: 2,
  [USER_TIER.ENTERPRISE]: 3,
};

export function isSubscriptionDowngrade(
  currentTier: UserTier,
  product: CheckoutProduct,
): boolean {
  if (!isPaidSubscriptionProduct(product)) {
    return false;
  }
  const nextTier =
    product === CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION
      ? USER_TIER.STARTER
      : USER_TIER.PRO;
  return TIER_RANK[nextTier] < TIER_RANK[currentTier];
}
