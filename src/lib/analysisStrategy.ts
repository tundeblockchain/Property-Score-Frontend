import type { AnalysisStrategy } from '@/models';

export const DEFAULT_ANALYSIS_STRATEGY: AnalysisStrategy = 'hmo';

export function resolveAnalysisStrategy(
  value: AnalysisStrategy | undefined,
): AnalysisStrategy {
  return value === 'buy_to_let' ? 'buy_to_let' : DEFAULT_ANALYSIS_STRATEGY;
}

export function analysisStrategyLabel(
  value: AnalysisStrategy | undefined,
): string {
  return resolveAnalysisStrategy(value) === 'buy_to_let'
    ? 'Buy to let'
    : 'HMO conversion';
}
