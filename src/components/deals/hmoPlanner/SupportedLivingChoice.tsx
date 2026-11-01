import { Chip, Stack, Typography } from '@mui/material';
import { Fact } from '@/components/deals/common/Fact';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { HmoChoiceMetrics } from '@/models';

interface SupportedLivingChoiceProps<T extends string> {
  title: string;
  chosen: T;
  reason: string;
  options: ReadonlyArray<HmoChoiceMetrics<T>>;
  labelFor: (option: T) => string;
}

export function SupportedLivingChoice<T extends string>({
  title,
  chosen,
  reason,
  options,
  labelFor,
}: SupportedLivingChoiceProps<T>) {
  return (
    <Stack
      component="section"
      spacing={1}
      sx={{ flex: 1, minWidth: 240 }}
      aria-label={title}
    >
      <Typography variant="subtitle2">{title}</Typography>
      <Typography>Chosen: {labelFor(chosen)}</Typography>
      {reason ? (
        <Typography variant="body2" color="text.secondary">
          {reason}
        </Typography>
      ) : null}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
      >
        {options.map((metrics) => {
          const selected = metrics.option === chosen;
          return (
            <Stack
              key={metrics.option}
              spacing={1}
              sx={{
                flex: 1,
                minWidth: 160,
                borderLeft: 3,
                borderColor: selected ? 'success.main' : 'divider',
                pl: 1.5,
                py: 0.5,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" useFlexGap>
                <Typography fontWeight={600}>
                  {labelFor(metrics.option)}
                </Typography>
                {selected ? (
                  <Chip label="Chosen" size="small" color="success" />
                ) : null}
              </Stack>
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Fact
                  label="Net cash flow / yr"
                  value={formatCurrency(metrics.netCashFlowAnnual)}
                />
                <Fact
                  label="Est. ROI"
                  value={formatPercent(metrics.estimatedRoi)}
                />
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
