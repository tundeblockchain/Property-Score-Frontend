import { Alert, CircularProgress, Stack, Typography } from '@mui/material';
import { useRef, type ReactNode } from 'react';
import {
  getUserFacingAnalysisFailureMessage,
  getUserFacingErrorMessage,
  logError,
} from '@/lib/errors';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <Stack alignItems="center" spacing={2} py={6}>
      <CircularProgress size={36} />
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}

interface ErrorAlertProps {
  error: unknown;
  fallback?: string;
}

export function ErrorAlert({ error, fallback }: ErrorAlertProps) {
  const loggedError = useRef<unknown>(undefined);
  if (loggedError.current !== error) {
    loggedError.current = error;
    logError(error);
  }

  return (
    <Alert severity="error" role="alert">
      {getUserFacingErrorMessage(error, fallback)}
    </Alert>
  );
}

interface FailedAnalysisAlertProps {
  errorMessage?: string | null;
}

export function FailedAnalysisAlert({ errorMessage }: FailedAnalysisAlertProps) {
  const loggedMessage = useRef<string | null | undefined>(undefined);
  if (loggedMessage.current !== errorMessage) {
    loggedMessage.current = errorMessage;
    logError(errorMessage, 'Analysis failed');
  }

  return (
    <Alert severity="error" role="alert">
      {getUserFacingAnalysisFailureMessage(errorMessage)}
    </Alert>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      spacing={2}
      mb={3}
    >
      <Stack spacing={0.5}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle ? (
          <Typography color="text.secondary">{subtitle}</Typography>
        ) : null}
      </Stack>
      {action}
    </Stack>
  );
}
