import { Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { AnalyseForm } from '@/components/analyse/AnalyseForm';
import { AnalysisProgress } from '@/components/analyse/AnalysisProgress';
import { useAuth } from '@/auth/AuthContext';
import { useBilling } from '@/hooks/useBilling';

export function TryItPanel() {
  const { user } = useAuth();
  const billing = useBilling();
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <Paper
      id="try"
      sx={{
        p: { xs: 2.5, sm: 4 },
        scrollMarginTop: (theme) => theme.spacing(12),
      }}
    >
      {jobId ? (
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Your analysis
          </Typography>
          <AnalysisProgress jobId={jobId} onReset={() => setJobId(null)} />
        </Stack>
      ) : (
        <AnalyseForm
          creditsRemaining={billing.data?.creditsRemaining}
          onAccepted={setJobId}
          heading="Try it now — score a listing"
          description={
            user
              ? 'Paste a Rightmove, OnTheMarket, or Zoopla property link and we will score it straight away.'
              : 'Paste a Rightmove, OnTheMarket, or Zoopla property link. We will ask you to sign in or create an account just before the analysis runs, then show the result here.'
          }
          submitLabel="Analyse listing"
        />
      )}
    </Paper>
  );
}
