import { Chip } from '@mui/material';
import { analysisStrategyLabel } from '@/lib/analysisStrategy';
import type { AnalysisStrategy } from '@/models';

interface AnalysisStrategyChipProps {
  strategy?: AnalysisStrategy;
}

export function AnalysisStrategyChip({ strategy }: AnalysisStrategyChipProps) {
  return (
    <Chip
      size="small"
      label={analysisStrategyLabel(strategy)}
      variant="outlined"
    />
  );
}
