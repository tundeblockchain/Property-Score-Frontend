import {
  Alert,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type FormEvent } from 'react';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { trackLeadOnce } from '@/lib/analytics';
import { getAuthErrorMessage } from '@/lib/authErrors';
import { SITE_NAME } from '@/lib/seo';

interface AuthFormProps {
  mode: 'signIn' | 'signUp';
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onToggleMode: () => void;
  /** Replaces the default supporting copy, e.g. to explain why sign-in is needed. */
  description?: string;
  /** Lets the heading title a dialog instead of the page. */
  headingComponent?: 'h1' | 'h2';
  headingId?: string;
}

export function AuthForm({
  mode,
  onSubmit,
  onGoogleSignIn,
  onToggleMode,
  description,
  headingComponent = 'h1',
  headingId,
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busy = submitting || googleSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleSubmitting(true);
    try {
      await onGoogleSignIn();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setGoogleSubmitting(false);
    }
  }

  const isSignIn = mode === 'signIn';

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h4" component={headingComponent} id={headingId}>
          {isSignIn ? 'Sign in' : 'Create account'}
        </Typography>
        <Typography color="text.secondary">
          {description ??
            (isSignIn
              ? `Use Google or your ${SITE_NAME} account to continue.`
              : 'New accounts start on the Free plan with 5 listing analyses.')}
        </Typography>
      </Stack>

      <Button
        type="button"
        variant="outlined"
        size="large"
        color="secondary"
        disabled={busy}
        onClick={() => void handleGoogleSignIn()}
        startIcon={<GoogleIcon />}
        sx={{
          bgcolor: 'background.paper',
          borderColor: 'divider',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'grey.50',
            borderColor: 'grey.400',
          },
        }}
      >
        {googleSubmitting ? 'Connecting…' : 'Continue with Google'}
      </Button>

      <Divider>
        <Typography variant="caption" color="text.secondary">
          or
        </Typography>
      </Divider>

      <Stack
        component="form"
        spacing={2}
        onSubmit={(e) => void handleSubmit(e)}
        noValidate
      >
        <TextField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
          disabled={busy}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete={isSignIn ? 'current-password' : 'new-password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          disabled={busy}
          inputProps={{ minLength: 6 }}
        />
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Button type="submit" variant="contained" size="large" disabled={busy}>
          {submitting
            ? 'Please wait…'
            : isSignIn
              ? 'Sign in'
              : 'Create account'}
        </Button>
        <Button
          onClick={() => {
            if (isSignIn) {
              trackLeadOnce({ content_name: 'sign_up' });
            }
            onToggleMode();
          }}
          disabled={busy}
        >
          {isSignIn
            ? 'Need an account? Sign up'
            : 'Already have an account? Sign in'}
        </Button>
      </Stack>
    </Stack>
  );
}
