import type { CheckoutProduct, UserTier } from '@/models';

export interface PlanComparison {
  included: string[];
  missing: string[];
}

export interface PlanOption {
  product: CheckoutProduct;
  title: string;
  priceLabel: string;
  creditsLabel: string;
  description: string;
  /** Tier comparison for subscriptions. */
  comparison?: PlanComparison;
  /** Simple feature list for non-tier products such as credit packs. */
  features?: string[];
  highlight?: boolean;
}

export interface PlanFeatureGroup {
  label: string;
  included: string[];
  missing: string[];
}

export const ANALYSIS_CREDIT_COST = 1;
export const PROPOSED_LAYOUT_CREDIT_COST = 3;

type ComparisonTier = 'FREE' | 'STARTER' | 'PRO';

const TIER_ORDER: Record<ComparisonTier, number> = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
};

const SUBSCRIPTION_CAPABILITIES: ReadonlyArray<{
  label: string;
  minTier: ComparisonTier;
  /** When set, the capability appears only on this tier (not inherited by higher tiers). */
  exclusiveTier?: ComparisonTier;
}> = [
  { label: 'Overall score and financial model', minTier: 'FREE' },
  { label: 'EPC and sold comparables', minTier: 'FREE' },
  { label: 'Recommended HMO scheme summary', minTier: 'FREE' },
  { label: '20 credits / month', minTier: 'STARTER', exclusiveTier: 'STARTER' },
  { label: 'Full score breakdown', minTier: 'STARTER' },
  { label: 'Floor-plan vision', minTier: 'STARTER' },
  { label: 'All HMO schemes, BoQ, licensing and fire checks', minTier: 'STARTER' },
  { label: 'Narrative and action plan', minTier: 'STARTER' },
  { label: 'Transport and schools', minTier: 'STARTER' },
  { label: 'PDF export', minTier: 'STARTER' },
  { label: 'Unlimited deal history', minTier: 'STARTER' },
  { label: '60 credits / month', minTier: 'PRO', exclusiveTier: 'PRO' },
  { label: 'Full area insights', minTier: 'PRO' },
  { label: 'Money comparison', minTier: 'PRO' },
];

export function planComparisonForTier(tier: ComparisonTier): PlanComparison {
  const rank = TIER_ORDER[tier];
  const included: string[] = [];
  const missing: string[] = [];

  for (const capability of SUBSCRIPTION_CAPABILITIES) {
    const minRank = TIER_ORDER[capability.minTier];

    if (capability.exclusiveTier) {
      const exclusiveRank = TIER_ORDER[capability.exclusiveTier];
      if (rank === exclusiveRank) {
        included.push(capability.label);
      } else if (rank < minRank) {
        missing.push(capability.label);
      }
      continue;
    }

    if (rank >= minRank) {
      included.push(capability.label);
    } else {
      missing.push(capability.label);
    }
  }

  return { included, missing };
}

const CREDIT_USAGE_FEATURES = [
  `${ANALYSIS_CREDIT_COST} credit per analysis`,
  `${PROPOSED_LAYOUT_CREDIT_COST} credits per proposed layout`,
  'Never expires while your account is active',
] as const;

export const FREE_PLAN_SUMMARY: Omit<PlanOption, 'product' | 'highlight'> = {
  title: 'Free',
  priceLabel: '£0',
  creditsLabel: '5 credits to start',
  description:
    'Try the core score and comparables. Upgrade to unlock the full HMO planner, PDF export and more credits.',
  comparison: planComparisonForTier('FREE'),
};

export const SUBSCRIPTION_PLANS: PlanOption[] = [
  {
    product: 'starter_subscription',
    title: 'Starter',
    priceLabel: '£39 / month',
    creditsLabel: '20 credits / month',
    description:
      'Full reports with floor-plan vision, HMO planner, PDF export and standard area insights.',
    comparison: planComparisonForTier('STARTER'),
  },
  {
    product: 'pro_subscription',
    title: 'Pro',
    priceLabel: '£99 / month',
    creditsLabel: '60 credits / month',
    description:
      'Higher volume screening plus full area data and money comparison.',
    comparison: planComparisonForTier('PRO'),
    highlight: true,
  },
];

export const SUBSCRIPTION_PLAN_FEATURES: PlanFeatureGroup[] = [
  {
    label: FREE_PLAN_SUMMARY.title,
    ...planComparisonForTier('FREE'),
  },
  ...SUBSCRIPTION_PLANS.map((plan) => ({
    label: plan.title,
    included: plan.comparison?.included ?? [],
    missing: plan.comparison?.missing ?? [],
  })),
];

export const CREDIT_PACK_PLANS: PlanOption[] = [
  {
    product: 'credits_5',
    title: '5 Credits',
    priceLabel: '£14 one-time',
    creditsLabel: '+5 credits',
    description: 'Quick top-up for a few extra listings.',
    features: ['Adds 5 credits to your balance', ...CREDIT_USAGE_FEATURES],
  },
  {
    product: 'credits_15',
    title: '15 Credits',
    priceLabel: '£35 one-time',
    creditsLabel: '+15 credits',
    description: 'A busy month without changing your subscription.',
    features: ['Adds 15 credits to your balance', ...CREDIT_USAGE_FEATURES],
  },
  {
    product: 'credits_40',
    title: '40 Credits',
    priceLabel: '£79 one-time',
    creditsLabel: '+40 credits',
    description: 'Best value for occasional sourcers and agents.',
    features: ['Adds 40 credits to your balance', ...CREDIT_USAGE_FEATURES],
    highlight: true,
  },
  {
    product: 'credits_100',
    title: '100 Credits',
    priceLabel: '£169 one-time',
    creditsLabel: '+100 credits',
    description: 'Bulk screening without a monthly commitment.',
    features: ['Adds 100 credits to your balance', ...CREDIT_USAGE_FEATURES],
  },
];

/** @deprecated Use SUBSCRIPTION_PLANS and CREDIT_PACK_PLANS */
export const PLAN_OPTIONS: PlanOption[] = [...SUBSCRIPTION_PLANS, ...CREDIT_PACK_PLANS];

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
