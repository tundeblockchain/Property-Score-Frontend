import {
  Alert,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ErrorAlert } from '@/components/common/Feedback';
import { useStartAnalysis } from '@/hooks/useAnalysisJob';
import {
  ApiError,
  getUserFacingErrorMessage,
  logError,
} from '@/lib/errors';
import { isValidRightmoveUrl } from '@/lib/rightmoveUrl';

interface AnalyseFormProps {
  creditsRemaining: number | undefined;
  onAccepted: (jobId: string) => void;
}

export function AnalyseForm({
  creditsRemaining,
  onAccepted,
}: AnalyseFormProps) {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const start = useStartAnalysis();

  const outOfCredits =
    creditsRemaining !== undefined && creditsRemaining <= 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!isValidRightmoveUrl(url)) {
      setLocalError(
        'Enter a valid Rightmove property URL (e.g. https://www.rightmove.co.uk/properties/123).',
      );
      return;
    }

    start.mutate(url, {
      onSuccess: (data) => onAccepted(data.jobId),
    });
  }

  const mutationError = start.error;
  const showUpgrade =
    mutationError instanceof ApiError && mutationError.isInsufficientCredits;

  useEffect(() => {
    if (mutationError && showUpgrade) {
      logError(mutationError);
    }
  }, [mutationError, showUpgrade]);

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" component="h2">
        Analyse a listing
      </Typography>
      <TextField
        label="Rightmove URL"
        name="rightmove_url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://www.rightmove.co.uk/properties/173188025"
        fullWidth
        required
        disabled={start.isPending || outOfCredits}
        error={Boolean(localError)}
        helperText={localError ?? 'Each analysis uses 1 credit.'}
      />
      {outOfCredits ? (
        <Alert severity="warning">
          You are out of credits.{' '}
          <Button component={RouterLink} to="/billing" size="small">
            Upgrade or buy credits
          </Button>
        </Alert>
      ) : null}
      {showUpgrade ? (
        <Alert severity="warning">
          {getUserFacingErrorMessage(mutationError)}{' '}
          <Button component={RouterLink} to="/billing" size="small">
            Go to billing
          </Button>
        </Alert>
      ) : null}
      {mutationError && !showUpgrade ? (
        <ErrorAlert error={mutationError} />
      ) : null}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={start.isPending || outOfCredits}
      >
        {start.isPending ? 'Starting…' : 'Start analysis'}
      </Button>
    </Stack>
  );
}
