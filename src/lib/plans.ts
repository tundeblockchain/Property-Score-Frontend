import type { CheckoutProduct, UserTier } from '@/models';

export interface PlanOption {
  product: CheckoutProduct;
  title: string;
  priceLabel: string;
  creditsLabel: string;
  description: string;
  highlight?: boolean;
}

export const ANALYSIS_CREDIT_COST = 1;
export const PROPOSED_LAYOUT_CREDIT_COST = 3;

export const FREE_PLAN_SUMMARY: Omit<PlanOption, 'product' | 'highlight'> = {
  title: 'Free',
  priceLabel: '£0',
  creditsLabel: '5 credits to start',
  description:
    'Overall score, financial model, EPC and sold comparables. Upgrade for the full HMO planner and PDF export.',
};

export const SUBSCRIPTION_PLANS: PlanOption[] = [
  {
    product: 'starter_subscription',
    title: 'Starter',
    priceLabel: '£39 / month',
    creditsLabel: '20 credits / month',
    description:
      'Full reports with floor-plan vision, HMO planner, PDF export and standard area insights.',
  },
  {
    product: 'pro_subscription',
    title: 'Pro',
    priceLabel: '£99 / month',
    creditsLabel: '60 credits / month',
    description:
      'Higher volume screening plus full area data, money comparison and unlimited deal history.',
    highlight: true,
  },
];

export const CREDIT_PACK_PLANS: PlanOption[] = [
  {
    product: 'credits_5',
    title: '5 Credits',
    priceLabel: '£14 one-time',
    creditsLabel: '+5 credits',
    description: 'Quick top-up for a few extra listings.',
  },
  {
    product: 'credits_15',
    title: '15 Credits',
    priceLabel: '£35 one-time',
    creditsLabel: '+15 credits',
    description: 'A busy month without changing your subscription.',
  },
  {
    product: 'credits_40',
    title: '40 Credits',
    priceLabel: '£79 one-time',
    creditsLabel: '+40 credits',
    description: 'Best value for occasional sourcers and agents.',
    highlight: true,
  },
  {
    product: 'credits_100',
    title: '100 Credits',
    priceLabel: '£169 one-time',
    creditsLabel: '+100 credits',
    description: 'Bulk screening without a monthly commitment.',
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
