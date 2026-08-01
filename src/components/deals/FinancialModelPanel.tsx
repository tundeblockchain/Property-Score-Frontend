import { Stack, Typography } from '@mui/material';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { FinancialModel } from '@/models';

interface FinancialModelPanelProps {
  model: FinancialModel;
}

export function FinancialModelPanel({ model }: FinancialModelPanelProps) {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Asking price', value: formatCurrency(model.askingPrice) },
    {
      label: 'Est. monthly rent',
      value: formatCurrency(model.estimatedRentMonthly),
    },
    { label: 'Gross yield', value: formatPercent(model.grossYield) },
    {
      label: 'Net cash flow (annual)',
      value: formatCurrency(model.netCashFlowAnnual),
    },
    { label: 'Est. ROI', value: formatPercent(model.estimatedRoi) },
  ];

  return (
    <Stack spacing={1}>
      {rows.map((row) => (
        <Stack
          key={row.label}
          direction="row"
          justifyContent="space-between"
          spacing={2}
        >
          <Typography color="primary.main">{row.label}</Typography>
          <Typography fontWeight={600} color="primary.dark">
            {row.value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
