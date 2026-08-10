import { Dialog, DialogContent, IconButton } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { CloseIcon } from '@/components/common/icons';

const HEADING_ID = 'auth-dialog-title';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  /** Runs once Firebase has accepted the credentials, e.g. to resume a pending action. */
  onAuthenticated?: () => void;
  initialMode?: 'signIn' | 'signUp';
  description?: string;
}

export function AuthDialog({
  open,
  onClose,
  onAuthenticated,
  initialMode = 'signIn',
  description,
}: AuthDialogProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>(initialMode);

  async function handleSubmit(email: string, password: string) {
    if (mode === 'signIn') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
    onAuthenticated?.();
  }

  async function handleGoogleSignIn() {
    await signInWithGoogle();
    onAuthenticated?.();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby={HEADING_ID}
    >
      <IconButton
        aria-label="Close"
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          onToggleMode={() =>
            setMode((current) => (current === 'signIn' ? 'signUp' : 'signIn'))
          }
          description={description}
          headingComponent="h2"
          headingId={HEADING_ID}
        />
      </DialogContent>
    </Dialog>
  );
}
