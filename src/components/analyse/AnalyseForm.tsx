import {
  Alert,
  Button,
  FormLabel,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useEffect, useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { ErrorAlert } from '@/components/common/Feedback';
import { useStartAnalysis } from '@/hooks/useAnalysisJob';
import { DEFAULT_ANALYSIS_STRATEGY } from '@/lib/analysisStrategy';
import {
  ApiError,
  getUserFacingErrorMessage,
  logError,
} from '@/lib/errors';
import { isValidListingUrl } from '@/lib/listingUrl';
import type { AnalysisStrategy } from '@/models';

const INVALID_URL_MESSAGE =
  'Enter a valid Rightmove, OnTheMarket, or Zoopla property URL (e.g. https://www.rightmove.co.uk/properties/123).';

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
  const [strategy, setStrategy] = useState<AnalysisStrategy>(
    DEFAULT_ANALYSIS_STRATEGY,
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const start = useStartAnalysis();

  const outOfCredits =
    creditsRemaining !== undefined && creditsRemaining <= 0;

  function startAnalysis(listingUrl: string) {
    start.mutate(
      { listingUrl, strategy },
      {
        onSuccess: (data) => onAccepted(data.jobId),
      },
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!isValidListingUrl(url)) {
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
    if (isValidListingUrl(url)) {
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
      <Stack spacing={1}>
        <FormLabel id="analysis-strategy-label">Analysis type</FormLabel>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={strategy}
          onChange={(_event, next: AnalysisStrategy | null) => {
            if (next) {
              setStrategy(next);
            }
          }}
          aria-labelledby="analysis-strategy-label"
          disabled={start.isPending || outOfCredits}
        >
          <ToggleButton value="hmo">HMO conversion</ToggleButton>
          <ToggleButton value="buy_to_let">Buy to let</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="caption" color="text.secondary">
          {strategy === 'buy_to_let'
            ? 'Scores a whole-house family AST. Skips HMO conversion schemes.'
            : 'Scores room-by-room HMO schemes against the listing.'}
        </Typography>
      </Stack>
      <TextField
        label="Listing URL"
        name="listing_url"
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
            ? 'Each listing uses 1 analysis.'
            : 'New accounts start with 5 free analyses — no card required.')
        }
      />
      {outOfCredits ? (
        <Alert severity="warning">
          You are out of analyses.{' '}
          <Button component={RouterLink} to="/billing" size="small">
            Upgrade or buy more
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
