import { Chip, Stack, Typography } from '@mui/material';
import { formatCreditCostLabel, tierLabel } from '@/lib/plans';
import type { BillingSummaryResponse } from '@/models';

interface BillingSummaryProps {
  billing: BillingSummaryResponse;
}

export function BillingSummary({ billing }: BillingSummaryProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Chip label={tierLabel(billing.tier)} color="primary" />
        <Chip
          label={`${billing.creditsRemaining} credits left`}
          variant="outlined"
        />
        {billing.stripeSubscriptionStatus ? (
          <Chip
            label={`Subscription: ${billing.stripeSubscriptionStatus}`}
            variant="outlined"
            size="small"
          />
        ) : null}
      </Stack>
      <Typography color="text.secondary">
        Signed in as {billing.email}. Monthly allowance:{' '}
        {billing.monthlyAllowance} credits.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formatCreditCostLabel(billing.analysisCreditCost, 'analysis')} ·{' '}
        {formatCreditCostLabel(billing.proposedLayoutCreditCost, 'layout')}
      </Typography>
    </Stack>
  );
}
