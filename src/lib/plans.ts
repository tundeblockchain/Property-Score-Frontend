import type { CheckoutProduct, UserTier } from '@/models';

export interface PlanOption {
  product: CheckoutProduct;
  title: string;
  priceLabel: string;
  creditsLabel: string;
  description: string;
  highlight?: boolean;
}

export const FREE_PLAN_SUMMARY: Omit<PlanOption, 'product' | 'highlight'> = {
  title: 'Free',
  priceLabel: 'No card required',
  creditsLabel: '5 credits to start',
  description: 'Score your first listings and see the full report format.',
};

export const PLAN_OPTIONS: PlanOption[] = [
  {
    product: 'starter_subscription',
    title: 'Starter',
    priceLabel: 'Monthly',
    creditsLabel: '25 credits / month',
    description: 'For investors analysing a few properties each month.',
  },
  {
    product: 'pro_subscription',
    title: 'Pro',
    priceLabel: 'Monthly',
    creditsLabel: '100 credits / month',
    description: 'Higher volume screening with room to spare.',
    highlight: true,
  },
  {
    product: 'credits_10',
    title: '10 Credits',
    priceLabel: 'One-time',
    creditsLabel: '+10 credits',
    description: 'Top up without changing your subscription.',
  },
];

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
