import {
  useCallback,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { setTokenProvider } from '@/api/client';
import { AuthContext } from '@/auth/AuthContext';
import {
  getFirebaseIdToken,
  signIn as firebaseSignIn,
  signInWithGoogle as firebaseSignInWithGoogle,
  signOutUser,
  signUp as firebaseSignUp,
  subscribeToAuth,
} from '@/auth/firebase';
import {
  trackCompleteRegistration,
  trackStartTrial,
} from '@/lib/analytics';
import type { User } from '@/models';

setTokenProvider(() => getFirebaseIdToken(false));

interface AuthSnapshot {
  user: User | null;
  loading: boolean;
}

const INITIAL_AUTH: AuthSnapshot = { user: null, loading: true };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const snapshotRef = useRef<AuthSnapshot>(INITIAL_AUTH);

  const subscribe = useCallback((onStoreChange: () => void) => {
    return subscribeToAuth((nextUser) => {
      snapshotRef.current = { user: nextUser, loading: false };
      onStoreChange();
    });
  }, []);

  const { user, loading } = useSyncExternalStore(
    subscribe,
    () => snapshotRef.current,
    () => INITIAL_AUTH,
  );

  const getIdToken = useCallback(async (forceRefresh = false) => {
    return getFirebaseIdToken(forceRefresh);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await firebaseSignIn(email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await firebaseSignUp(email, password);
    trackCompleteRegistration('email');
    trackStartTrial();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { isNewUser } = await firebaseSignInWithGoogle();
    if (isNewUser) {
      trackCompleteRegistration('google');
      trackStartTrial();
    }
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      getIdToken,
    }),
    [user, loading, signIn, signUp, signInWithGoogle, signOut, getIdToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
