import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { ErrorAlert } from '@/components/common/Feedback';

const SUBJECT_MIN = 3;
const SUBJECT_MAX = 120;
const BODY_MIN = 10;
const BODY_MAX = 4000;

export interface AccountMessageValues {
  subject: string;
  body: string;
}

interface AccountMessageFormProps {
  title: string;
  description: string;
  bodyLabel: string;
  submitLabel: string;
  pendingLabel: string;
  successMessage: string;
  pending: boolean;
  error: unknown;
  succeeded: boolean;
  onSubmit: (values: AccountMessageValues) => Promise<void>;
}

export function AccountMessageForm({
  title,
  description,
  bodyLabel,
  submitLabel,
  pendingLabel,
  successMessage,
  pending,
  error,
  succeeded,
  onSubmit,
}: AccountMessageFormProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextSubject = subject.trim();
    const nextBody = body.trim();

    if (
      nextSubject.length < SUBJECT_MIN ||
      nextSubject.length > SUBJECT_MAX
    ) {
      setValidationError(
        `Subject must be between ${SUBJECT_MIN} and ${SUBJECT_MAX} characters.`,
      );
      return;
    }

    if (nextBody.length < BODY_MIN || nextBody.length > BODY_MAX) {
      setValidationError(
        `${bodyLabel} must be between ${BODY_MIN} and ${BODY_MAX} characters.`,
      );
      return;
    }

    setValidationError(null);
    try {
      await onSubmit({ subject: nextSubject, body: nextBody });
      setSubject('');
      setBody('');
    } catch {
      // Parent surfaces the mutation error.
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
      <Stack
        component="form"
        spacing={2}
        aria-label={title}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        noValidate
      >
        <TextField
          label="Subject"
          name="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          required
          fullWidth
          disabled={pending}
          inputProps={{ minLength: SUBJECT_MIN, maxLength: SUBJECT_MAX }}
        />
        <TextField
          label={bodyLabel}
          name="message"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
          fullWidth
          multiline
          minRows={4}
          disabled={pending}
          inputProps={{ minLength: BODY_MIN, maxLength: BODY_MAX }}
        />
        {validationError ? (
          <Alert severity="error" role="alert">
            {validationError}
          </Alert>
        ) : null}
        {error ? <ErrorAlert error={error} /> : null}
        {succeeded && !error ? (
          <Alert severity="success">{successMessage}</Alert>
        ) : null}
        <Button type="submit" variant="contained" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
