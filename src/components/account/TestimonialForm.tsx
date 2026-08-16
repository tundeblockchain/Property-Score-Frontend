import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { ErrorAlert } from '@/components/common/Feedback';

const NAME_MIN = 2;
const NAME_MAX = 80;
const ROLE_MAX = 80;
const QUOTE_MIN = 10;
const QUOTE_MAX = 4000;

export interface TestimonialFormValues {
  displayName: string;
  role?: string;
  quote: string;
}

interface TestimonialFormProps {
  pending: boolean;
  error: unknown;
  succeeded: boolean;
  onSubmit: (values: TestimonialFormValues) => Promise<void>;
}

export function TestimonialForm({
  pending,
  error,
  succeeded,
  onSubmit,
}: TestimonialFormProps) {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = displayName.trim();
    const nextRole = role.trim();
    const nextQuote = quote.trim();

    if (nextName.length < NAME_MIN || nextName.length > NAME_MAX) {
      setValidationError(
        `Display name must be between ${NAME_MIN} and ${NAME_MAX} characters.`,
      );
      return;
    }

    if (nextRole.length > ROLE_MAX) {
      setValidationError(`Role must be at most ${ROLE_MAX} characters.`);
      return;
    }

    if (nextQuote.length < QUOTE_MIN || nextQuote.length > QUOTE_MAX) {
      setValidationError(
        `Quote must be between ${QUOTE_MIN} and ${QUOTE_MAX} characters.`,
      );
      return;
    }

    setValidationError(null);
    try {
      await onSubmit({
        displayName: nextName,
        quote: nextQuote,
        ...(nextRole ? { role: nextRole } : {}),
      });
      setDisplayName('');
      setRole('');
      setQuote('');
    } catch {
      // Parent surfaces the mutation error.
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2">
        Share a testimonial
      </Typography>
      <Typography color="text.secondary">
        Tell other investors what helped. We review every quote before it
        appears on the landing page.
      </Typography>
      <Stack
        component="form"
        spacing={2}
        aria-label="Share a testimonial"
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        noValidate
      >
        <TextField
          label="Display name"
          name="displayName"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          required
          fullWidth
          disabled={pending}
          helperText="How you would like to appear, for example James or J. Patel."
          inputProps={{ minLength: NAME_MIN, maxLength: NAME_MAX }}
        />
        <TextField
          label="Role or location (optional)"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          fullWidth
          disabled={pending}
          helperText="For example HMO investor, Manchester."
          inputProps={{ maxLength: ROLE_MAX }}
        />
        <TextField
          label="Your quote"
          name="quote"
          value={quote}
          onChange={(event) => setQuote(event.target.value)}
          required
          fullWidth
          multiline
          minRows={4}
          disabled={pending}
          inputProps={{ minLength: QUOTE_MIN, maxLength: QUOTE_MAX }}
        />
        {validationError ? (
          <Alert severity="error" role="alert">
            {validationError}
          </Alert>
        ) : null}
        {error ? <ErrorAlert error={error} /> : null}
        {succeeded && !error ? (
          <Alert severity="success">
            Thanks. We have received your testimonial and will review it shortly.
          </Alert>
        ) : null}
        <Button type="submit" variant="contained" disabled={pending}>
          {pending ? 'Sending…' : 'Send testimonial'}
        </Button>
      </Stack>
    </Stack>
  );
}
