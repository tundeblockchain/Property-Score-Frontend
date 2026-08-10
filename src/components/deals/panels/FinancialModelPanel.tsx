import { Box, Typography } from '@mui/material';
import { Fragment } from 'react';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { FinancialModel } from '@/models';

interface FinancialModelPanelProps {
  model: FinancialModel;
}

interface FinancialRow {
  readonly label: string;
  readonly value: string;
  /** Set only where the sign of the figure is itself the signal. */
  readonly valueColor?: string;
}

function cashFlowColor(value: number | undefined): string | undefined {
  if (value == null || value === 0) {
    return undefined;
  }
  return value > 0 ? 'success.dark' : 'error.dark';
}

export function FinancialModelPanel({ model }: FinancialModelPanelProps) {
  const rows: FinancialRow[] = [
    { label: 'Asking price', value: formatCurrency(model.askingPrice) },
    {
      label: 'Est. monthly rent',
      value: formatCurrency(model.estimatedRentMonthly),
    },
    { label: 'Gross yield', value: formatPercent(model.grossYield) },
    {
      label: 'Net cash flow (annual)',
      value: formatCurrency(model.netCashFlowAnnual),
      valueColor: cashFlowColor(model.netCashFlowAnnual),
    },
    { label: 'Est. ROI', value: formatPercent(model.estimatedRoi) },
  ];

  return (
    <Box
      component="dl"
      sx={{
        m: 0,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        columnGap: 2,
        '& > dt, & > dd': {
          m: 0,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
        '& > dt:last-of-type, & > dd:last-of-type': {
          borderBottom: 0,
          pb: 0,
        },
      }}
    >
      {rows.map((row) => (
        <Fragment key={row.label}>
          <Typography component="dt" color="text.secondary">
            {row.label}
          </Typography>
          <Typography
            component="dd"
            fontWeight={600}
            sx={{
              color: row.valueColor ?? 'text.primary',
              textAlign: 'right',
              // Keeps the money column aligned digit for digit.
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {row.value}
          </Typography>
        </Fragment>
      ))}
    </Box>
  );
}
