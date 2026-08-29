import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/auth/AuthContext';
import { AuthProvider } from '@/auth/AuthProvider';

const firebaseSignUp = vi.fn();
const firebaseSignInWithGoogle = vi.fn();
const trackCompleteRegistration = vi.fn();
const trackStartTrial = vi.fn();

vi.mock('@/auth/firebase', () => ({
  subscribeToAuth: (callback: (user: null) => void) => {
    callback(null);
    return () => {};
  },
  getFirebaseIdToken: vi.fn().mockResolvedValue(null),
  signIn: vi.fn(),
  signUp: (...args: unknown[]) => firebaseSignUp(...args),
  signInWithGoogle: (...args: unknown[]) => firebaseSignInWithGoogle(...args),
  signOutUser: vi.fn(),
}));

vi.mock('@/api/client', () => ({
  setTokenProvider: vi.fn(),
}));

vi.mock('@/lib/analytics', () => ({
  trackCompleteRegistration: (...args: unknown[]) =>
    trackCompleteRegistration(...args),
  trackStartTrial: (...args: unknown[]) => trackStartTrial(...args),
}));

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthProvider acquisition events', () => {
  beforeEach(() => {
    firebaseSignUp.mockResolvedValue({ email: 'new@example.com' });
    firebaseSignInWithGoogle.mockResolvedValue({
      user: { email: 'new@example.com' },
      isNewUser: true,
    });
    trackCompleteRegistration.mockClear();
    trackStartTrial.mockClear();
  });

  it('tracks CompleteRegistration and StartTrial after email sign-up', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signUp('new@example.com', 'secret1');

    expect(trackCompleteRegistration).toHaveBeenCalledWith('email');
    expect(trackStartTrial).toHaveBeenCalledOnce();
  });

  it('tracks a new Google account but not a returning sign-in', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signInWithGoogle();
    expect(trackCompleteRegistration).toHaveBeenCalledWith('google');
    expect(trackStartTrial).toHaveBeenCalledOnce();

    trackCompleteRegistration.mockClear();
    trackStartTrial.mockClear();
    firebaseSignInWithGoogle.mockResolvedValue({
      user: { email: 'old@example.com' },
      isNewUser: false,
    });

    await result.current.signInWithGoogle();
    expect(trackCompleteRegistration).not.toHaveBeenCalled();
    expect(trackStartTrial).not.toHaveBeenCalled();
  });
});
