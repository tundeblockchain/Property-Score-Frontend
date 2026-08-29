import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import { resetAnalyticsConsentForTests, setAnalyticsConsent } from '@/lib/analyticsConsent';
import type { User } from '@/models';

const syncAdvertisingAnalytics = vi.fn();
const trackSpaPageViewIfChanged = vi.fn();
const disableAdvertisingAnalytics = vi.fn();

vi.mock('@/lib/analytics', () => ({
  syncAdvertisingAnalytics: (...args: unknown[]) =>
    syncAdvertisingAnalytics(...args),
  trackSpaPageViewIfChanged: (...args: unknown[]) =>
    trackSpaPageViewIfChanged(...args),
  disableAdvertisingAnalytics: (...args: unknown[]) =>
    disableAdvertisingAnalytics(...args),
}));

const authValue: AuthContextValue = {
  user: { email: 'investor@example.com', uid: 'uid_1' } as User,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue('token'),
};

function renderTracker(
  path = '/pricing',
  auth: AuthContextValue = authValue,
): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthContext.Provider value={auth}>
        <AnalyticsTracker />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe('AnalyticsTracker', () => {
  beforeEach(() => {
    resetAnalyticsConsentForTests();
    syncAdvertisingAnalytics.mockClear();
    trackSpaPageViewIfChanged.mockClear();
    disableAdvertisingAnalytics.mockClear();
  });

  it('does not load advertising scripts before consent', () => {
    renderTracker('/pricing');
    expect(syncAdvertisingAnalytics).not.toHaveBeenCalled();
    expect(trackSpaPageViewIfChanged).not.toHaveBeenCalled();
  });

  it('initialises with advanced matching and tracks the route after consent', () => {
    setAnalyticsConsent('granted');
    renderTracker('/pricing');

    expect(syncAdvertisingAnalytics).toHaveBeenCalledWith({
      em: 'investor@example.com',
      external_id: 'uid_1',
    });
    expect(trackSpaPageViewIfChanged).toHaveBeenCalledWith('/pricing');
  });

  it('waits for auth before sending the first page view', () => {
    setAnalyticsConsent('granted');
    renderTracker('/', { ...authValue, loading: true, user: null });

    expect(syncAdvertisingAnalytics).not.toHaveBeenCalled();
    expect(trackSpaPageViewIfChanged).not.toHaveBeenCalled();
  });

  it('stops advertising when consent is withdrawn', () => {
    setAnalyticsConsent('denied');
    renderTracker('/pricing');
    expect(disableAdvertisingAnalytics).toHaveBeenCalledOnce();
    expect(syncAdvertisingAnalytics).not.toHaveBeenCalled();
  });
});
