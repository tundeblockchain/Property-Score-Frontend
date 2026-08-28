import { describe, expect, it } from 'vitest';
import {
  analysisStrategyLabel,
  resolveAnalysisStrategy,
} from '@/lib/analysisStrategy';

describe('analysisStrategy', () => {
  it('treats missing values as HMO conversion', () => {
    expect(resolveAnalysisStrategy(undefined)).toBe('hmo');
    expect(analysisStrategyLabel(undefined)).toBe('HMO conversion');
  });

  it('labels buy to let separately', () => {
    expect(resolveAnalysisStrategy('buy_to_let')).toBe('buy_to_let');
    expect(analysisStrategyLabel('buy_to_let')).toBe('Buy to let');
  });
});
