import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { PlanCards, PlanCardShell } from '@/components/billing/PlanCards';
import { ErrorAlert, LoadingState, PageHeader } from '@/components/common/Feedback';
import { useBilling } from '@/hooks/useBilling';
import { useBillingPlans } from '@/hooks/useBillingPlans';
import { useCheckout } from '@/hooks/useBillingMutations';
import { trackLeadOnce } from '@/lib/analytics';
import { formatCreditCostLabel, remainingAnalysesLabel, tierLabel } from '@/lib/plans';
import { PROPERTIES_PATH } from '@/lib/paths';
import type { CheckoutProduct, PlanCatalogItem } from '@/models';

type PendingAction =
  | { kind: 'checkout'; product: CheckoutProduct }
  | { kind: 'startFree' };

function comparisonGroups(plans: PlanCatalogItem[]) {
  return plans.map((plan) => ({
    label: plan.title,
    included: plan.comparison?.included ?? [],
    missing: plan.comparison?.missing ?? [],
  }));
}

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const billing = useBilling();
  const plans = useBillingPlans();
  const checkout = useCheckout();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  function handleSelect(product: CheckoutProduct) {
    if (!user) {
      trackLeadOnce({ content_name: 'sign_up' });
      setPendingAction({ kind: 'checkout', product });
      return;
    }
    checkout.mutate(product);
  }

  function handleAuthenticated() {
    const action = pendingAction;
    setPendingAction(null);
    if (action?.kind === 'checkout') {
      checkout.mutate(action.product);
      return;
    }
    void navigate(PROPERTIES_PATH);
  }

  if (plans.isLoading) {
    return <LoadingState label="Loading plans…" />;
  }

  if (plans.isError || !plans.data) {
    return <ErrorAlert error={plans.error ?? new Error('Plans unavailable')} />;
  }

  const catalog = plans.data;
  const featureGroups = comparisonGroups([
    catalog.freePlan,
    ...catalog.subscriptionPlans,
  ]);

  return (
    <Stack spacing={4} pb={{ xs: 4, md: 6 }}>
      <PageHeader
        title="Pricing"
        subtitle={`${formatCreditCostLabel(catalog.analysisCreditCost, 'analysis')}. ${formatCreditCostLabel(catalog.proposedLayoutCreditCost, 'layout')}.`}
      />

      {user && billing.data ? (
        <Alert
          severity="info"
          action={
            <Button component={RouterLink} to="/billing" color="inherit" size="small">
              Billing
            </Button>
          }
        >
          You are on the {tierLabel(billing.data.tier)} plan with{' '}
          {remainingAnalysesLabel(billing.data.creditsRemaining).toLowerCase()}.
        </Alert>
      ) : null}

      <Stack spacing={1.5}>
        <Typography variant="h5" component="h2">
          Subscriptions
        </Typography>
        <PlanCards
          plans={catalog.subscriptionPlans}
          loadingProduct={checkout.isPending ? (checkout.variables ?? null) : null}
          error={checkout.error}
          onSelect={handleSelect}
          currentTier={billing.data?.tier}
          leadingCard={
            <PlanCardShell
              {...catalog.freePlan}
              action={
                user ? (
                  <Button component={RouterLink} to="/analyse" variant="outlined">
                    Analyse a listing
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      trackLeadOnce({ content_name: 'sign_up' });
                      setPendingAction({ kind: 'startFree' });
                    }}
                  >
                    Start free
                  </Button>
                )
              }
            />
          }
        />
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="h5" component="h2">
          Extra analyses
        </Typography>
        <Typography variant="body2" color="text.secondary">
          One shared balance for listing analyses and proposed layouts. Top-ups
          never expire while your account is active.
        </Typography>
        <PlanCards
          plans={catalog.creditPacks}
          loadingProduct={checkout.isPending ? (checkout.variables ?? null) : null}
          error={null}
          onSelect={handleSelect}
        />
      </Stack>

      <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Compare plans
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}
            gap={2}
          >
            {featureGroups.map((plan) => (
              <Stack key={plan.label} spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {plan.label}
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Included
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                    {plan.included.map((item) => (
                      <Typography key={item} component="li" variant="body2">
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Stack>
                {plan.missing.length > 0 ? (
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Not included
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                      {plan.missing.map((item) => (
                        <Typography
                          key={item}
                          component="li"
                          variant="body2"
                          color="text.secondary"
                        >
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  </Stack>
                ) : null}
              </Stack>
            ))}
          </Box>
        </Stack>
      </Paper>

      <Typography variant="body2" color="text.secondary">
        Payments and subscription changes are handled by Stripe. You can
        upgrade, downgrade or cancel at any time from the billing page.
      </Typography>

      <AuthDialog
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onAuthenticated={handleAuthenticated}
        initialMode="signUp"
        description={
          pendingAction?.kind === 'checkout'
            ? 'Create an account or sign in to continue to checkout.'
            : `Create an account to start scoring listings with ${catalog.freePlan.creditsLabel}.`
        }
      />
    </Stack>
  );
}
