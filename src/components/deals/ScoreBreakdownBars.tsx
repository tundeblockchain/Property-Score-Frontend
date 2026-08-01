import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import type { ScoreBreakdown } from '@/models';

const SCORE_LABELS: Array<{ key: keyof ScoreBreakdown; label: string }> = [
  { key: 'overall', label: 'Overall' },
  { key: 'financial', label: 'Financial' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'marketDemand', label: 'Market demand' },
  { key: 'location', label: 'Location' },
  { key: 'refurb', label: 'Refurb' },
];

interface ScoreBreakdownBarsProps {
  scores: ScoreBreakdown;
  compact?: boolean;
}

export function ScoreBreakdownBars({
  scores,
  compact = false,
}: ScoreBreakdownBarsProps) {
  const entries = compact
    ? SCORE_LABELS.filter((item) => item.key === 'overall')
    : SCORE_LABELS;

  return (
    <Stack spacing={1.5}>
      {entries.map(({ key, label }) => (
        <Box key={key}>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" color="primary.main">
              {label}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.dark">
              {scores[key]}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, scores[key]))}
            sx={{ height: 8, borderRadius: 999 }}
          />
        </Box>
      ))}
    </Stack>
  );
}
