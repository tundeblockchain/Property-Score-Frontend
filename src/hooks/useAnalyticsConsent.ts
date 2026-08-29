import { useSyncExternalStore } from 'react';
import {
  getAnalyticsConsent,
  subscribeAnalyticsConsent,
  type AnalyticsConsent,
} from '@/lib/analyticsConsent';

export function useAnalyticsConsent(): AnalyticsConsent {
  return useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsent,
    () => null,
  );
}
