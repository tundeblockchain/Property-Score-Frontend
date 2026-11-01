import { Chip, Stack, Typography } from '@mui/material';
import { Fact } from '@/components/deals/common/Fact';
import { formatCurrency, formatPercent } from '@/lib/format';

export interface SupportedLivingChoiceOption<T extends string> {
  option: T;
  netCashFlowAnnual: number;
  estimatedRoi: number;
}

interface SupportedLivingChoiceProps<T extends string> {
  title: string;
  chosen: T;
  reason: string;
  options: ReadonlyArray<SupportedLivingChoiceOption<T>>;
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
    <Stack spacing={1} sx={{ flex: 1, minWidth: 240 }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography>Chosen: {labelFor(chosen)}</Typography>
      <Typography variant="body2" color="text.secondary">
        {reason}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
      >
        {options.map((money) => {
          const selected = money.option === chosen;
          return (
            <Stack
              key={money.option}
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
                  {labelFor(money.option)}
                </Typography>
                {selected ? (
                  <Chip label="Chosen" size="small" color="success" />
                ) : null}
              </Stack>
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Fact
                  label="Net cash flow / yr"
                  value={formatCurrency(money.netCashFlowAnnual)}
                />
                <Fact
                  label="Est. ROI"
                  value={formatPercent(money.estimatedRoi)}
                />
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
