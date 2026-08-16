import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { ManageSubscriptionButton } from '@/components/billing/ManageSubscriptionButton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  ErrorAlert,
  LoadingState,
  PageHeader,
} from '@/components/common/Feedback';
import { AccountMessageForm } from '@/components/account/AccountMessageForm';
import {
  useClearDeals,
  useContactTeam,
  useDeleteAccount,
  useReportBug,
} from '@/hooks/useAccountMutations';
import { useBilling } from '@/hooks/useBilling';
import { tierLabel } from '@/lib/plans';

export function AccountPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const billing = useBilling();
  const clearDeals = useClearDeals();
  const deleteAccount = useDeleteAccount();
  const reportBug = useReportBug();
  const contactTeam = useContactTeam();
  const [clearOpen, setClearOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleClearConfirm() {
    try {
      await clearDeals.mutateAsync();
      setClearOpen(false);
    } catch {
      // Error is shown via the mutation state.
    }
  }

  async function handleDeleteConfirm() {
    try {
      await deleteAccount.mutateAsync();
      setDeleteOpen(false);
      await signOut();
      navigate('/', { replace: true });
    } catch {
      // Error is shown via the mutation state.
    }
  }

  if (billing.isLoading) {
    return <LoadingState label="Loading account…" />;
  }

  if (billing.isError || !billing.data) {
    return (
      <ErrorAlert error={billing.error ?? new Error('Account unavailable')} />
    );
  }

  const hasSubscription = Boolean(billing.data.stripeSubscriptionId);

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Account"
        subtitle="Manage your subscription, properties, and account."
      />

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">
            Profile
          </Typography>
          <Typography>
            Signed in as <strong>{billing.data.email}</strong>
          </Typography>
          <Typography color="text.secondary">
            Plan: {tierLabel(billing.data.tier)}. {billing.data.creditsRemaining}{' '}
            credits remaining
            {billing.data.stripeSubscriptionStatus
              ? `. Subscription: ${billing.data.stripeSubscriptionStatus}`
              : '.'}
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">
            Subscription
          </Typography>
          <Typography color="text.secondary">
            {hasSubscription
              ? 'Update payment details or cancel through the Stripe billing portal.'
              : 'You are on the free plan. Choose a paid plan or credit top-up on the billing page.'}
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <ManageSubscriptionButton hasSubscription={hasSubscription} />
            <Button component={RouterLink} to="/billing" variant="outlined">
              {hasSubscription ? 'View plans' : 'Choose a plan'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <AccountMessageForm
          title="Report a bug"
          description="Tell us what went wrong. We will email the team and keep a copy of your report."
          bodyLabel="What happened?"
          submitLabel="Send bug report"
          pendingLabel="Sending…"
          successMessage="Thanks. We have sent your bug report to the team."
          pending={reportBug.isPending}
          error={reportBug.error}
          succeeded={reportBug.isSuccess}
          onSubmit={async ({ subject, body }) => {
            await reportBug.mutateAsync({ subject, description: body });
          }}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <AccountMessageForm
          title="Contact us"
          description="Ask a question about billing, analysis, or your account."
          bodyLabel="Your question"
          submitLabel="Send message"
          pendingLabel="Sending…"
          successMessage="Thanks. We have sent your message to the team."
          pending={contactTeam.isPending}
          error={contactTeam.error}
          succeeded={contactTeam.isSuccess}
          onSubmit={async ({ subject, body }) => {
            await contactTeam.mutateAsync({ subject, message: body });
          }}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">
            Properties
          </Typography>
          <Typography color="text.secondary">
            Permanently delete every analysed property, report, and proposed
            layout. Credits and your subscription are not affected.
          </Typography>
          {clearDeals.isSuccess ? (
            <Alert severity="success">
              Deleted {clearDeals.data.deletedCount}{' '}
              {clearDeals.data.deletedCount === 1 ? 'property' : 'properties'}.
            </Alert>
          ) : null}
          {clearDeals.isError ? <ErrorAlert error={clearDeals.error} /> : null}
          <Button
            color="error"
            variant="outlined"
            onClick={() => setClearOpen(true)}
            disabled={clearDeals.isPending || deleteAccount.isPending}
          >
            Clear all properties
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h2">
            Delete account
          </Typography>
          <Typography color="text.secondary">
            This cancels your subscription, deletes all properties, and
            permanently removes your account. This cannot be undone.
          </Typography>
          {deleteAccount.isError ? (
            <ErrorAlert error={deleteAccount.error} />
          ) : null}
          <Button
            color="error"
            variant="contained"
            onClick={() => setDeleteOpen(true)}
            disabled={deleteAccount.isPending || clearDeals.isPending}
          >
            Delete account
          </Button>
        </Stack>
      </Paper>

      <ConfirmDialog
        open={clearOpen}
        title="Clear all properties?"
        description="This permanently deletes every analysed property and its reports. This cannot be undone."
        confirmLabel="Clear all properties"
        pending={clearDeals.isPending}
        pendingLabel="Deleting…"
        onClose={() => setClearOpen(false)}
        onConfirm={() => {
          void handleClearConfirm();
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete your account?"
        description="This cancels billing, deletes all properties, and permanently removes your account."
        confirmLabel="Delete account"
        confirmPhrase={billing.data.email}
        pending={deleteAccount.isPending}
        pendingLabel="Deleting…"
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
      />
    </Stack>
  );
}
