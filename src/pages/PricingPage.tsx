import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { PlanCards, PlanCardShell } from '@/components/billing/PlanCards';
import { PageHeader } from '@/components/common/Feedback';
import { useBilling } from '@/hooks/useBilling';
import { useCheckout } from '@/hooks/useBillingMutations';
import {
  CREDIT_PACK_PLANS,
  formatCreditCostLabel,
  FREE_PLAN_SUMMARY,
  PROPOSED_LAYOUT_CREDIT_COST,
  SUBSCRIPTION_PLANS,
  tierLabel,
} from '@/lib/plans';
import { PROPERTIES_PATH } from '@/lib/paths';
import type { CheckoutProduct } from '@/models';

type PendingAction =
  | { kind: 'checkout'; product: CheckoutProduct }
  | { kind: 'startFree' };

const PLAN_FEATURES = [
  {
    label: 'Free',
    items: [
      'Overall score and financial model',
      'EPC and sold comparables',
      'Recommended HMO scheme summary',
      'Last 5 saved deals',
    ],
  },
  {
    label: 'Starter',
    items: [
      '20 credits / month',
      'Full score breakdown and floor-plan vision',
      'All HMO schemes, BoQ, licensing and fire checks',
      'Transport, schools and PDF export',
    ],
  },
  {
    label: 'Pro',
    items: [
      '60 credits / month',
      'Full area insights and money comparison',
      'Unlimited deal history',
    ],
  },
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
        subtitle={`${formatCreditCostLabel(1, 'analysis')}. Proposed layouts use ${formatCreditCostLabel(PROPOSED_LAYOUT_CREDIT_COST, 'layout')}.`}
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

      <Stack spacing={1.5}>
        <Typography variant="h5" component="h2">
          Subscriptions
        </Typography>
        <PlanCards
          plans={SUBSCRIPTION_PLANS}
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
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="h5" component="h2">
          Credit top-ups
        </Typography>
        <Typography variant="body2" color="text.secondary">
          One credit pool for analyses and proposed layouts. Top-ups never expire
          while your account is active.
        </Typography>
        <PlanCards
          plans={CREDIT_PACK_PLANS}
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
            {PLAN_FEATURES.map((plan) => (
              <Stack key={plan.label} spacing={1}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {plan.label}
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {plan.items.map((item) => (
                    <Typography key={item} component="li" variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  ))}
                </Box>
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
