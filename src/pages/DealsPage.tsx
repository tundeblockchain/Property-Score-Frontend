import { Stack } from '@mui/material';
import {
  ErrorAlert,
  LoadingState,
  PageHeader,
} from '@/components/common/Feedback';
import { DealList } from '@/components/deals/DealList';
import { useDeals } from '@/hooks/useDeals';

export function DealsPage() {
  const { data, isLoading, isError, error } = useDeals();

  return (
    <Stack spacing={2}>
      <PageHeader
        title="Properties"
        subtitle="Your 25 most recent analyses, newest first."
      />
      {isLoading ? <LoadingState label="Loading properties…" /> : null}
      {isError ? <ErrorAlert error={error} /> : null}
      {data ? <DealList deals={data.deals} /> : null}
    </Stack>
  );
}
