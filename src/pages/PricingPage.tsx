import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { PlanCards, PlanCardShell } from '@/components/billing/PlanCards';
import { PageHeader } from '@/components/common/Feedback';
import { CheckIcon } from '@/components/common/icons';
import { useBilling } from '@/hooks/useBilling';
import { useCheckout } from '@/hooks/useBillingMutations';
import { PROPERTIES_PATH } from '@/lib/paths';
import { FREE_PLAN_SUMMARY, PLAN_OPTIONS, tierLabel } from '@/lib/plans';
import type { CheckoutProduct } from '@/models';

type PendingAction =
  | { kind: 'checkout'; product: CheckoutProduct }
  | { kind: 'startFree' };

const INCLUDED_IN_EVERY_PLAN = [
  'Overall score with financial, compliance, market, location and refurb breakdowns',
  'Financial model with estimated rent, gross yield, cash flow and ROI',
  'HMO planner, licensing checks and fire escape assessment',
  'Area enrichment: EPC, planning, sold prices, crime, schools, transport, broadband',
  'Floor plan room detection and extension potential',
  'PDF export and a saved history of every analysis',
];

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const billing = useBilling();
  const checkout = useCheckout();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  function handleSelect(product: CheckoutProduct) {
    if (!user) {
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
    navigate(PROPERTIES_PATH);
  }

  return (
    <Stack spacing={4} pb={{ xs: 4, md: 6 }}>
      <PageHeader
        title="Pricing"
        subtitle="One credit per analysis. Start on the Free plan and upgrade when you are screening more deals."
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
          {billing.data.creditsRemaining} credits remaining.
        </Alert>
      ) : null}

      <PlanCards
        plans={PLAN_OPTIONS}
        loadingProduct={checkout.isPending ? (checkout.variables ?? null) : null}
        error={checkout.error}
        onSelect={handleSelect}
        leadingCard={
          <PlanCardShell
            {...FREE_PLAN_SUMMARY}
            action={
              user ? (
                <Button component={RouterLink} to="/analyse" variant="outlined">
                  Analyse a listing
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setPendingAction({ kind: 'startFree' })}
                >
                  Start free
                </Button>
              )
            }
          />
        }
      />

      <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Every plan includes
          </Typography>
          <Box
            component="ul"
            sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1.25 }}
          >
            {INCLUDED_IN_EVERY_PLAN.map((item) => (
              <Stack
                key={item}
                component="li"
                direction="row"
                spacing={1.25}
                alignItems="flex-start"
              >
                <Box color="primary.main" mt={0.25} display="flex">
                  <CheckIcon />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item}
                </Typography>
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
            : 'Create an account to start scoring listings with 5 free credits.'
        }
      />
    </Stack>
  );
}
