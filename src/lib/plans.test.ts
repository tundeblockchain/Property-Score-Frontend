import { describe, expect, it } from 'vitest';
import { formatCreditCostLabel, tierLabel } from '@/lib/plans';

describe('plan copy helpers', () => {
  it('formats credit costs for analysis and layout', () => {
    expect(formatCreditCostLabel(1, 'analysis')).toBe('1 credit per analysis');
    expect(formatCreditCostLabel(3, 'layout')).toBe('3 credits per layout');
  });

  it('labels known tiers', () => {
    expect(tierLabel('FREE')).toBe('Free');
    expect(tierLabel('STARTER')).toBe('Starter');
    expect(tierLabel('PRO')).toBe('Pro');
  });
});
