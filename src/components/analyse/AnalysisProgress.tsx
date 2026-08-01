import { Button, LinearProgress, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  ErrorAlert,
  FailedAnalysisAlert,
  LoadingState,
} from '@/components/common/Feedback';
import { DealStatusChip } from '@/components/deals/DealStatusChip';
import { ScoreBreakdownBars } from '@/components/deals/ScoreBreakdownBars';
import { useAnalysisJob } from '@/hooks/useAnalysisJob';

interface AnalysisProgressProps {
  jobId: string;
  onReset: () => void;
}

export function AnalysisProgress({ jobId, onReset }: AnalysisProgressProps) {
  const { data, isLoading, isError, error } = useAnalysisJob(jobId);


  if (isLoading && !data) {
    return <LoadingState label="Connecting to analysis…" />;
  }

  if (isError) {
    return (
      <Stack spacing={2}>
        <ErrorAlert error={error} />
        <Button onClick={onReset}>Try another listing</Button>
      </Stack>
    );
  }

  if (!data) {
    return null;
  }

  if (data.status === 'FAILED') {
    return (
      <Stack spacing={2}>
        <DealStatusChip status="FAILED" />
        <FailedAnalysisAlert errorMessage={data.errorMessage} />
        <Button onClick={onReset}>Try another listing</Button>
      </Stack>
    );
  }

  if (data.status === 'COMPLETED') {
    return (
      <Stack spacing={2}>
        <DealStatusChip status="COMPLETED" />
        <Typography variant="h6">Analysis complete</Typography>
        {data.scores ? <ScoreBreakdownBars scores={data.scores} /> : null}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            component={RouterLink}
            to={`/deals/${jobId}`}
            variant="contained"
          >
            View full report
          </Button>
          <Button onClick={onReset}>Analyse another</Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <DealStatusChip status="PROCESSING" />
      <Typography variant="h6">Analysing listing…</Typography>
      <Typography color="text.secondary">
        This usually takes 15–40 seconds. You can leave this page open.
      </Typography>
      <LinearProgress />
      <Typography variant="caption" color="text.secondary">
        Job {jobId}
      </Typography>
    </Stack>
  );
}
