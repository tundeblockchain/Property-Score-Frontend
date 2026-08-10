import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { ScoreBreakdown } from '@/models';

const SCORE_LABELS: Array<{ key: keyof ScoreBreakdown; label: string }> = [
  { key: 'overall', label: 'Overall' },
  { key: 'financial', label: 'Financial' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'marketDemand', label: 'Market demand' },
  { key: 'location', label: 'Location' },
  { key: 'refurb', label: 'Refurb' },
];

type ScoreTone = 'error' | 'warning' | 'info' | 'success';

/** Traffic-light style bands for 0–100 scores. */
function scoreTone(score: number): ScoreTone {
  if (score < 50) return 'error';
  if (score < 65) return 'warning';
  if (score < 80) return 'info';
  return 'success';
}

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
      {entries.map(({ key, label }) => {
        const value = Math.min(100, Math.max(0, scores[key]));
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
