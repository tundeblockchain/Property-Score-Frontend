import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TierLockedOverlay } from '@/components/billing/TierLockedOverlay';
import { clampScore, scoreTone } from '@/lib/scores';
import type { ScoreBreakdown, TierAccess } from '@/models';

const SCORE_LABELS: Array<{ key: keyof ScoreBreakdown; label: string }> = [
  { key: 'overall', label: 'Overall' },
  { key: 'financial', label: 'Financial' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'marketDemand', label: 'Market demand' },
  { key: 'location', label: 'Location' },
  { key: 'refurb', label: 'Refurb' },
];

const PREMIUM_SCORE_KEYS = new Set<keyof ScoreBreakdown>([
  'compliance',
  'marketDemand',
  'location',
  'refurb',
]);

const LOCKED_SCORE_PREVIEW: Record<
  'compliance' | 'marketDemand' | 'location' | 'refurb',
  number
> = {
  compliance: 72,
  marketDemand: 58,
  location: 81,
  refurb: 46,
};

interface ScoreBreakdownBarsProps {
  scores: ScoreBreakdown;
  compact?: boolean;
  /** Turn off where the overall score is already shown, such as the report. */
  includeOverall?: boolean;
  tierAccess?: TierAccess;
}

interface ScoreBarRowProps {
  label: string;
  value: number;
  maskValue?: boolean;
}

function ScoreBarRow({ label, value, maskValue = false }: ScoreBarRowProps) {
  const clamped = clampScore(value);
  const tone = scoreTone(clamped);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={600}
          color={`${tone}.dark`}
          sx={maskValue ? { filter: 'blur(4px)', userSelect: 'none' } : undefined}
          aria-hidden={maskValue}
        >
          {value}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={clamped}
        aria-hidden={maskValue}
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
}

export function ScoreBreakdownBars({
  scores,
  compact = false,
  includeOverall = true,
  tierAccess,
}: ScoreBreakdownBarsProps) {
  const scoreBreakdownLocked =
    tierAccess != null && !tierAccess.scoreBreakdown;

  const entries = SCORE_LABELS.filter((item) => {
    if (compact) {
      return item.key === 'overall';
    }
    if (!includeOverall && item.key === 'overall') {
      return false;
    }
    if (scoreBreakdownLocked && PREMIUM_SCORE_KEYS.has(item.key)) {
      return false;
    }
    return true;
  });

  const lockedPreviewEntries = SCORE_LABELS.filter((item) =>
    PREMIUM_SCORE_KEYS.has(item.key),
  );

  return (
    <Stack spacing={1.5}>
      {entries.map(({ key, label }) => (
        <ScoreBarRow key={key} label={label} value={scores[key]} />
      ))}
      {scoreBreakdownLocked ? (
        <TierLockedOverlay
          title="Full score breakdown"
          description="Upgrade to Starter to unlock compliance, market, location and refurb sub-scores."
        >
          <Stack spacing={1.5}>
            {lockedPreviewEntries.map(({ key, label }) => (
              <ScoreBarRow
                key={key}
                label={label}
                value={LOCKED_SCORE_PREVIEW[key as keyof typeof LOCKED_SCORE_PREVIEW]}
                maskValue
              />
            ))}
          </Stack>
        </TierLockedOverlay>
      ) : null}
    </Stack>
  );
}
