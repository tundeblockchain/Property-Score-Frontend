export type AnalyticsConsent = 'granted' | 'denied' | null;

export const ANALYTICS_CONSENT_STORAGE_KEY = 'ps_analytics_consent';

const listeners = new Set<() => void>();
let snapshot: AnalyticsConsent = null;
let didRead = false;

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function readStored(): AnalyticsConsent {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (value === 'granted' || value === 'denied') {
      return value;
    }
  } catch {
    // Private mode or blocked storage should not break the app.
  }
  return null;
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (!didRead && typeof window !== 'undefined') {
    snapshot = readStored();
    didRead = true;
  }
  return snapshot;
}

export function hasAdvertisingConsent(): boolean {
  return getAnalyticsConsent() === 'granted';
}

export function setAnalyticsConsent(decision: 'granted' | 'denied'): void {
  snapshot = decision;
  didRead = true;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, decision);
  } catch {
    // Private mode or blocked storage should not break the app.
  }
  emit();
}

export function subscribeAnalyticsConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetAnalyticsConsentForTests(): void {
  snapshot = null;
  didRead = false;
  listeners.clear();
  try {
    window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
