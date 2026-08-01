import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { env } from '@/config/env';

const app = initializeApp(env.firebase);
export const firebaseAuth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('email');
googleProvider.addScope('profile');

export function subscribeToAuth(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(firebaseAuth, callback);
}

export async function getFirebaseIdToken(
  forceRefresh = false,
): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) {
    return null;
  }
  return user.getIdToken(forceRefresh);
}

export async function signIn(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return result.user;
}

export async function signUp(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return result.user;
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(firebaseAuth);
}
