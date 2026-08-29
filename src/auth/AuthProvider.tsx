import {
  useCallback,
  useEffect,
  useMemo,
  useState,
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

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const getIdToken = useCallback(async (forceRefresh = false) => {
    return getFirebaseIdToken(forceRefresh);
  }, []);

  useEffect(() => {
    setTokenProvider(() => getIdToken(false));
  }, [getIdToken]);

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
