import { Alert, Button, Stack, Typography } from '@mui/material';
import { useRef } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { LoadingState, PageHeader } from '@/components/common/Feedback';
import { useBilling } from '@/hooks/useBilling';
import {
  consumePendingCheckout,
  trackCheckoutCancelled,
  trackPurchaseOnce,
} from '@/lib/analytics';
import { remainingAnalysesLabel } from '@/lib/plans';

const POLL_MS = 2500;
const MAX_POLLS = 24;

export function BillingSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') ?? undefined;
  const purchaseTracked = useRef(false);
  const initialCredits = useRef<number | null>(null);
  const lastUpdatedAt = useRef(0);
  const updateCount = useRef(0);

  if (!purchaseTracked.current) {
    purchaseTracked.current = true;
    trackPurchaseOnce({
      sessionId,
      pending: consumePendingCheckout(),
    });
  }

  const billing = useBilling({
    refetchInterval: (query) =>
      query.state.dataUpdateCount >= MAX_POLLS ? false : POLL_MS,
  });

  if (billing.data && billing.dataUpdatedAt !== lastUpdatedAt.current) {
    lastUpdatedAt.current = billing.dataUpdatedAt;
    updateCount.current += 1;
    if (initialCredits.current === null) {
      initialCredits.current = billing.data.creditsRemaining;
    }
  }

  const updated =
    billing.data != null &&
    initialCredits.current != null &&
    (billing.data.creditsRemaining !== initialCredits.current ||
      updateCount.current >= 2);

  if (billing.isLoading && !billing.data) {
    return <LoadingState label="Confirming payment…" />;
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Payment successful" />
      <Alert severity="success">
        Thanks — your payment went through. Your analyses and plan will appear
        here in a moment. You can start analysing listings as soon as they
        show.
      </Alert>
      {billing.data ? (
        <Typography>
          Current plan: {billing.data.tier} ·{' '}
          {remainingAnalysesLabel(billing.data.creditsRemaining, 'remaining')}
          {!updated ? ' (refreshing…)' : ''}
        </Typography>
      ) : null}
      <Stack direction="row" spacing={1}>
        <Button component={RouterLink} to="/analyse" variant="contained">
          Analyse a listing
        </Button>
        <Button component={RouterLink} to="/billing" variant="outlined">
          Back to billing
        </Button>
      </Stack>
    </Stack>
  );
}

export function BillingCancelPage() {
  const cancelTracked = useRef(false);

  if (!cancelTracked.current) {
    cancelTracked.current = true;
    trackCheckoutCancelled(consumePendingCheckout());
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Checkout cancelled" />
      <Alert severity="info">
        No charge was made. You can restart checkout from the billing page.
      </Alert>
      <Button component={RouterLink} to="/billing" variant="contained">
        Return to billing
      </Button>
    </Stack>
  );
}
