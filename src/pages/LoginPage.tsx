import { Paper } from '@mui/material';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { LoadingState } from '@/components/common/Feedback';
import { resolvePostLoginPath } from '@/lib/paths';

export function LoginPage() {
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const from = resolvePostLoginPath(
    (location.state as { from?: unknown } | null)?.from,
  );

  if (loading) {
    return <LoadingState />;
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <Paper sx={{ p: { xs: 3, sm: 4 }, maxWidth: 480, mx: 'auto' }}>
      <AuthForm
        mode={mode}
        onSubmit={mode === 'signIn' ? signIn : signUp}
        onGoogleSignIn={signInWithGoogle}
        onToggleMode={() =>
          setMode((current) => (current === 'signIn' ? 'signUp' : 'signIn'))
        }
      />
    </Paper>
  );
}
