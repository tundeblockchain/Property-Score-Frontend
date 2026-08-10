import {
  Alert,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { ErrorAlert } from '@/components/common/Feedback';
import { useStartAnalysis } from '@/hooks/useAnalysisJob';
import {
  ApiError,
  getUserFacingErrorMessage,
  logError,
} from '@/lib/errors';
import { isValidRightmoveUrl } from '@/lib/rightmoveUrl';

const INVALID_URL_MESSAGE =
  'Enter a valid Rightmove property URL (e.g. https://www.rightmove.co.uk/properties/123).';

interface AnalyseFormProps {
  creditsRemaining: number | undefined;
  onAccepted: (jobId: string) => void;
  heading?: string;
  description?: string;
  submitLabel?: string;
}

export function AnalyseForm({
  creditsRemaining,
  onAccepted,
  heading = 'Analyse a listing',
  description,
  submitLabel = 'Start analysis',
}: AnalyseFormProps) {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const start = useStartAnalysis();

  const outOfCredits =
    creditsRemaining !== undefined && creditsRemaining <= 0;

  function startAnalysis(rightmoveUrl: string) {
    start.mutate(rightmoveUrl, {
      onSuccess: (data) => onAccepted(data.jobId),
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!isValidRightmoveUrl(url)) {
      setLocalError(INVALID_URL_MESSAGE);
      return;
    }

    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    startAnalysis(url);
  }

  function handleAuthenticated() {
    setAuthDialogOpen(false);
    if (isValidRightmoveUrl(url)) {
      startAnalysis(url);
    }
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
      <Stack spacing={0.5}>
        <Typography variant="h6" component="h2">
          {heading}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Stack>
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
        helperText={
          localError ??
          (user
            ? 'Each analysis uses 1 credit.'
            : 'New accounts start with 5 free credits — no card required.')
        }
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
        {start.isPending ? 'Starting…' : submitLabel}
      </Button>
      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onAuthenticated={handleAuthenticated}
        initialMode="signUp"
        description="Create an account or sign in to run the analysis. We have kept the listing you pasted."
      />
    </Stack>
  );
}
