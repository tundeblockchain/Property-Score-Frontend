import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useId, useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pending?: boolean;
  pendingLabel?: string;
  confirmPhrase?: string;
  confirmColor?: 'error' | 'primary';
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pending = false,
  pendingLabel = 'Please wait…',
  confirmPhrase,
  confirmColor = 'error',
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [typedPhrase, setTypedPhrase] = useState('');
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    setTypedPhrase('');
  }

  const phraseMatches =
    !confirmPhrase || typedPhrase.trim() === confirmPhrase;
  const confirmDisabled = pending || !phraseMatches;

  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId} sx={{ mb: confirmPhrase ? 2 : 0 }}>
          {description}
        </DialogContentText>
        {confirmPhrase ? (
          <TextField
            label={`Type ${confirmPhrase} to confirm`}
            value={typedPhrase}
            onChange={(event) => setTypedPhrase(event.target.value)}
            autoComplete="off"
            fullWidth
            disabled={pending}
          />
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={pending}>
          Cancel
        </Button>
        <Button
          color={confirmColor}
          variant="contained"
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {pending ? pendingLabel : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
