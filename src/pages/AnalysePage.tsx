import { Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { AnalyseForm } from '@/components/analyse/AnalyseForm';
import { AnalysisProgress } from '@/components/analyse/AnalysisProgress';
import {
  ErrorAlert,
  LoadingState,
  PageHeader,
} from '@/components/common/Feedback';
import { InsufficientCreditsBanner } from '@/components/layout/BrandAndCredits';
import { useBilling } from '@/hooks/useBilling';

export function AnalysePage() {
  const billing = useBilling();
  const [jobId, setJobId] = useState<string | null>(null);

  if (billing.isLoading) {
    return <LoadingState label="Loading account…" />;
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Analyse"
        subtitle="Paste a Rightmove listing URL to generate a property score and report."
      />
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
          />
        )}
      </Paper>
    </Stack>
  );
}
