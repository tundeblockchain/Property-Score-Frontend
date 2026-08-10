import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { clampScore, scoreTone } from '@/lib/scores';
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
  /** Turn off where the overall score is already shown, such as the report. */
  includeOverall?: boolean;
}

export function ScoreBreakdownBars({
  scores,
  compact = false,
  includeOverall = true,
}: ScoreBreakdownBarsProps) {
  const entries = compact
    ? SCORE_LABELS.filter((item) => item.key === 'overall')
    : SCORE_LABELS.filter((item) => includeOverall || item.key !== 'overall');

  return (
    <Stack spacing={1.5}>
      {entries.map(({ key, label }) => {
        const value = clampScore(scores[key]);
        const tone = scoreTone(value);

        return (
          <Box key={key}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={600} color={`${tone}.dark`}>
                {scores[key]}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={value}
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: (theme) => alpha(theme.palette[tone].main, 0.16),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  bgcolor: `${tone}.main`,
                },
              }}
            />
          </Box>
        );
      })}
    </Stack>
  );
}
