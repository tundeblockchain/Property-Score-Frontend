import { Alert, Button, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LoadingState, PageHeader } from '@/components/common/Feedback';
import { useBilling } from '@/hooks/useBilling';

const POLL_MS = 2500;
const MAX_POLLS = 24;

export function BillingSuccessPage() {
  const initialCredits = useRef<number | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const shouldPoll = pollCount < MAX_POLLS;
  const billing = useBilling({
    refetchInterval: shouldPoll ? POLL_MS : false,
  });

  useEffect(() => {
    if (billing.data && initialCredits.current === null) {
      initialCredits.current = billing.data.creditsRemaining;
    }
  }, [billing.data]);

  useEffect(() => {
    if (!shouldPoll) {
      return;
    }
    const id = window.setInterval(() => {
      setPollCount((count) => count + 1);
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [shouldPoll]);

  const updated =
    billing.data != null &&
    initialCredits.current != null &&
    (billing.data.creditsRemaining !== initialCredits.current ||
      pollCount >= 2);

  if (billing.isLoading && !billing.data) {
    return <LoadingState label="Confirming payment…" />;
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Payment successful" />
      <Alert severity="success">
        Stripe checkout completed. Credits and tier update after the webhook
        lands — usually within a few seconds.
      </Alert>
      {billing.data ? (
        <Typography>
          Current plan: {billing.data.tier} · {billing.data.creditsRemaining}{' '}
          credits remaining
          {!updated && shouldPoll ? ' (refreshing…)' : ''}
        </Typography>
      ) : null}
      <Stack direction="row" spacing={1}>
        <Button component={RouterLink} to="/" variant="contained">
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
