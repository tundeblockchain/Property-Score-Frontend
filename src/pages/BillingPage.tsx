import { Paper, Stack, Typography } from '@mui/material';
import {
  ErrorAlert,
  LoadingState,
  PageHeader,
} from '@/components/common/Feedback';
import { BillingSummary } from '@/components/billing/BillingSummary';
import { ManageSubscriptionButton } from '@/components/billing/ManageSubscriptionButton';
import { PlanCardShell, PlanCards } from '@/components/billing/PlanCards';
import { useBilling } from '@/hooks/useBilling';
import { useBillingPlans } from '@/hooks/useBillingPlans';
import { useCheckout } from '@/hooks/useBillingMutations';
import type { CheckoutProduct } from '@/models';

export function BillingPage() {
  const billing = useBilling();
  const plans = useBillingPlans();
  const checkout = useCheckout();

  function handleSelect(product: CheckoutProduct) {
    checkout.mutate(product);
  }

  if (billing.isLoading || plans.isLoading) {
    return <LoadingState label="Loading billing…" />;
  }

  if (billing.isError || !billing.data) {
    return (
      <ErrorAlert error={billing.error ?? new Error('Billing unavailable')} />
    );
  }

  if (plans.isError || !plans.data) {
    return <ErrorAlert error={plans.error ?? new Error('Plans unavailable')} />;
  }

  const catalog = plans.data;

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Billing"
        subtitle="Manage credits and subscription."
        action={
          <ManageSubscriptionButton
            hasSubscription={Boolean(billing.data.stripeSubscriptionId)}
          />
        }
      />

      <Paper sx={{ p: 3 }}>
        <BillingSummary billing={billing.data} />
      </Paper>

      <Stack spacing={1.5}>
        <Typography variant="h5" component="h2">
          Subscriptions
        </Typography>
        <PlanCards
          plans={catalog.subscriptionPlans}
          loadingProduct={
            checkout.isPending ? (checkout.variables ?? null) : null
          }
          error={checkout.error}
          onSelect={handleSelect}
          leadingCard={
            <PlanCardShell
              {...catalog.freePlan}
              action={
                billing.data.tier === 'FREE' ? (
                  <Typography variant="body2" color="text.secondary">
                    Current plan
                  </Typography>
                ) : null
              }
            />
          }
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="h5" component="h2">
          Credit top-ups
        </Typography>
        <PlanCards
          plans={catalog.creditPacks}
          loadingProduct={
            checkout.isPending ? (checkout.variables ?? null) : null
          }
          error={null}
          onSelect={handleSelect}
        />
      </Stack>
    </Stack>
  );
}
