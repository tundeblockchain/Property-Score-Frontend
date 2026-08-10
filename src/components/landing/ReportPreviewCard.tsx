import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ScoreBreakdownBars } from '@/components/deals/ScoreBreakdownBars';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { ScoreBreakdown } from '@/models';

const EXAMPLE_SCORES: ScoreBreakdown = {
  overall: 82,
  financial: 78,
  compliance: 88,
  marketDemand: 84,
  location: 76,
  refurb: 71,
};

const EXAMPLE_METRICS = [
  { label: 'Asking price', value: formatCurrency(285000) },
  { label: 'Est. rent', value: `${formatCurrency(1850)}/mo` },
  { label: 'Gross yield', value: formatPercent(7.8) },
];

/** Illustrative report card for the landing hero. Values are sample data, not a live analysis. */
export function ReportPreviewCard() {
  return (
    <Paper
      sx={{
        p: { xs: 2.5, sm: 3 },
        width: '100%',
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.28),
        boxShadow: '0 24px 60px -32px rgba(15, 118, 110, 0.45)',
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="overline" color="text.secondary">
            Example report
          </Typography>
          <Chip label="Completed" size="small" color="success" variant="outlined" />
        </Stack>

        <Stack direction="row" spacing={2.5} alignItems="center">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={92}
              thickness={4}
              sx={{ color: (theme) => alpha(theme.palette.primary.main, 0.14) }}
            />
            <CircularProgress
              variant="determinate"
              value={EXAMPLE_SCORES.overall}
              size={92}
              thickness={4}
              sx={{ position: 'absolute', left: 0, color: 'primary.main' }}
              aria-hidden
            />
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ position: 'absolute', inset: 0 }}
            >
              <Typography variant="h5" component="p" fontWeight={800}>
                {EXAMPLE_SCORES.overall}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                / 100
              </Typography>
            </Stack>
          </Box>
          <Stack spacing={0.5} minWidth={0}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              3-bed terrace, M14
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Strong yield, minor refurb, no licensing blockers.
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          {EXAMPLE_METRICS.map((metric) => (
            <Stack
              key={metric.label}
              spacing={0.25}
              sx={{
                flex: 1,
                p: 1.25,
                borderRadius: 1.5,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {metric.label}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {metric.value}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <ScoreBreakdownBars scores={EXAMPLE_SCORES} />
      </Stack>
    </Paper>
  );
}
