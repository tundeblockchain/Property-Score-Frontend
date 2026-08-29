import { useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';
import {
  disableAdvertisingAnalytics,
  syncAdvertisingAnalytics,
  trackSpaPageViewIfChanged,
} from '@/lib/analytics';

export function AnalyticsTracker() {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const consent = useAnalyticsConsent();

  if (consent === 'granted' && !loading) {
    syncAdvertisingAnalytics({
      em: user?.email ?? undefined,
      external_id: user?.uid,
    });
    trackSpaPageViewIfChanged(pathname);
  }

  if (consent === 'denied') {
    disableAdvertisingAnalytics();
  }

  return null;
}
