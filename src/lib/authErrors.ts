import { logError } from '@/lib/errors';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  'auth/popup-blocked':
    'Pop-up was blocked. Allow pop-ups for this site and try again.',
  'auth/account-exists-with-different-credential':
    'An account already exists with this email using a different sign-in method.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
  'auth/operation-not-allowed':
    'Google sign-in is not enabled for this project.',
};

function getFirebaseErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }
  const code = (error as { code: unknown }).code;
  return typeof code === 'string' ? code : null;
}

export function getAuthErrorMessage(
  error: unknown,
  fallback = 'Authentication failed. Please try again.',
): string {
  const code = getFirebaseErrorCode(error);
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  logError(error, 'Authentication error');
  return fallback;
}
