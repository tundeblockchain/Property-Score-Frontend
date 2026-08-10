import { Box, Stack, Typography } from '@mui/material';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { HmoMoneyComparison, HmoMoneySnapshot } from '@/models';
import { Fact } from '@/components/deals/common/Fact';

interface MoneyComparisonSectionProps {
  comparison: HmoMoneyComparison;
}

function signedCurrency(value: number): string {
  const formatted = formatCurrency(Math.abs(value));
  if (value > 0) {
    return `+${formatted}`;
  }
  if (value < 0) {
    return `−${formatted}`;
  }
  return formatted;
}

function signedPts(value: number): string {
  if (value > 0) {
    return `+${value.toFixed(2)}pp`;
  }
  if (value < 0) {
    return `${value.toFixed(2)}pp`;
  }
  return '0.00pp';
}

function SnapshotColumn({
  title,
  snapshot,
  emphasize,
}: {
  title: string;
  snapshot: HmoMoneySnapshot;
  emphasize?: boolean;
}) {
  return (
    <Stack
      spacing={1.5}
      sx={{
        flex: 1,
        minWidth: 200,
        borderLeft: 3,
        borderColor: emphasize ? 'success.main' : 'divider',
        pl: 1.5,
        py: 0.5,
      }}
    >
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {snapshot.occupancyBasis}
        {snapshot.label !== title ? ` · ${snapshot.label}` : ''}
      </Typography>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Est. monthly rent"
          value={formatCurrency(snapshot.estimatedRentMonthly)}
        />
        <Fact label="Gross yield" value={formatPercent(snapshot.grossYield)} />
        <Fact
          label="Net cash flow / yr"
          value={formatCurrency(snapshot.netCashFlowAnnual)}
        />
        <Fact label="Est. ROI" value={formatPercent(snapshot.estimatedRoi)} />
        <Fact
          label="Void assumed"
          value={`${Math.round(snapshot.voidRateAssumed * 100)}%`}
        />
      </Stack>
    </Stack>
  );
}

export function MoneyComparisonSection({
  comparison,
}: MoneyComparisonSectionProps) {
  const { asListedFamily, bestHmo, delta, notes } = comparison;

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2">
        Money: family let vs recommended HMO
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems="stretch"
      >
        <SnapshotColumn title="As-listed family let" snapshot={asListedFamily} />
        <SnapshotColumn
          title="Recommended HMO"
          snapshot={bestHmo}
          emphasize
        />
      </Stack>

      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          pt: 1.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Uplift (HMO − family)
        </Typography>
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
          <Fact label="Monthly rent" value={signedCurrency(delta.monthlyRentGbp)} />
          <Fact label="Gross yield" value={signedPts(delta.grossYieldPts)} />
          <Fact
            label="Net cash flow / yr"
            value={signedCurrency(delta.netCashFlowAnnualGbp)}
          />
          <Fact label="Est. ROI" value={signedPts(delta.estimatedRoiPts)} />
        </Stack>
      </Box>

      {notes.length > 0 ? (
        <Stack spacing={0.5}>
          {notes.map((note) => (
            <Typography key={note} variant="caption" color="text.secondary">
              {note}
            </Typography>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
