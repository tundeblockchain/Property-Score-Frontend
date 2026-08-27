import { Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { AnalyseForm } from '@/components/analyse/AnalyseForm';
import { AnalysisProgress } from '@/components/analyse/AnalysisProgress';
import {
  ErrorAlert,
  LoadingState,
  PageHeader,
} from '@/components/common/Feedback';
import { DealList } from '@/components/deals/list/DealList';
import { InsufficientCreditsBanner } from '@/components/layout/BrandAndCredits';
import { useBilling } from '@/hooks/useBilling';
import { useDeals } from '@/hooks/useDeals';

export function DealsPage() {
  const { data, isLoading, isError, error } = useDeals();
  const billing = useBilling();
  const [jobId, setJobId] = useState<string | null>(null);
  const deals = data?.deals ?? [];
  const showAnalyseForm = Boolean(data) && deals.length === 0;

  return (
    <Stack spacing={2}>
      <PageHeader
        title="Properties"
        subtitle={
          showAnalyseForm
            ? 'Paste a Rightmove or OnTheMarket listing to create your first report.'
            : 'Your 25 most recent analyses, newest first.'
        }
      />
      {isLoading ? <LoadingState label="Loading properties…" /> : null}
      {isError ? <ErrorAlert error={error} /> : null}
      {deals.length > 0 ? <DealList deals={deals} /> : null}
      {showAnalyseForm ? (
        <Stack spacing={2}>
          <InsufficientCreditsBanner
            show={(billing.data?.creditsRemaining ?? 0) <= 0}
          />
          {billing.isError ? <ErrorAlert error={billing.error} /> : null}
          <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            {jobId ? (
              <AnalysisProgress jobId={jobId} onReset={() => setJobId(null)} />
            ) : (
              <AnalyseForm
                creditsRemaining={billing.data?.creditsRemaining}
                onAccepted={setJobId}
                heading="Analyse a listing"
                description="New accounts start with 5 free analyses. Each listing uses 1; proposed layouts use 3."
              />
            )}
          </Paper>
        </Stack>
      ) : null}
    </Stack>
  );
}
