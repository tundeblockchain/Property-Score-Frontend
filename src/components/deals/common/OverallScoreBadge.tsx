import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { clampScore, scoreBandLabel, scoreTone } from '@/lib/scores';

type BadgeSize = 'sm' | 'md' | 'lg';

interface SizeConfig {
  readonly diameter: number;
  readonly thickness: number;
  readonly scoreFontSize: string;
  /** Undefined hides the "/100" suffix, which does not fit the small ring. */
  readonly outOfFontSize?: string;
}

const SIZES: Record<BadgeSize, SizeConfig> = {
  sm: { diameter: 48, thickness: 4.5, scoreFontSize: '1rem' },
  md: {
    diameter: 72,
    thickness: 4,
    scoreFontSize: '1.5rem',
    outOfFontSize: '0.75rem',
  },
  lg: {
    diameter: 104,
    thickness: 3.6,
    scoreFontSize: '2rem',
    outOfFontSize: '0.9rem',
  },
};

interface OverallScoreBadgeProps {
  score: number;
  size?: BadgeSize;
  /** Shows the band word ("Strong", "Weak") beneath the ring. */
  showBand?: boolean;
}

export function OverallScoreBadge({
  score,
  size = 'md',
  showBand = false,
}: OverallScoreBadgeProps) {
  const { diameter, thickness, scoreFontSize, outOfFontSize } = SIZES[size];
  const value = clampScore(score);
  const displayed = Math.round(value);
  const tone = scoreTone(value);
  const band = scoreBandLabel(value);

  return (
    <Stack
      role="img"
      aria-label={`Overall score ${displayed} out of 100, ${band}`}
      alignItems="center"
      spacing={0.5}
      sx={{ flexShrink: 0 }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          width: diameter,
          height: diameter,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={diameter}
          thickness={thickness}
          sx={{ color: (theme) => alpha(theme.palette[tone].main, 0.16) }}
        />
        <CircularProgress
          variant="determinate"
          value={value}
          size={diameter}
          thickness={thickness}
          color={tone}
          sx={{ position: 'absolute', left: 0 }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Inner row keeps the score and the suffix on a shared baseline
              without pinning them to the top of the ring. */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
            <Typography
              component="span"
              fontWeight={700}
              fontSize={scoreFontSize}
              lineHeight={1}
              color={`${tone}.dark`}
            >
              {displayed}
            </Typography>
            {outOfFontSize ? (
              <Typography
                component="span"
                fontWeight={600}
                fontSize={outOfFontSize}
                lineHeight={1}
                color="text.secondary"
              >
                /100
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Box>
      {showBand ? (
        <Typography
          variant="body2"
          fontWeight={700}
          color={`${tone}.dark`}
          lineHeight={1.2}
        >
          {band}
        </Typography>
      ) : null}
    </Stack>
  );
}
