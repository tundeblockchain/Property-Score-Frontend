import { Button } from '@mui/material';
import { ErrorAlert } from '@/components/common/Feedback';
import { usePortal } from '@/hooks/useBillingMutations';

interface ManageSubscriptionButtonProps {
  hasSubscription: boolean;
}

export function ManageSubscriptionButton({
  hasSubscription,
}: ManageSubscriptionButtonProps) {
  const portal = usePortal();

  if (!hasSubscription) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        disabled={portal.isPending}
        onClick={() => portal.mutate()}
      >
        {portal.isPending ? 'Opening portal…' : 'Manage subscription'}
      </Button>
      {portal.isError ? <ErrorAlert error={portal.error} /> : null}
    </>
  );
}
