import { describe, expect, it } from 'vitest';
import {
  getAnalyticsConsent,
  resetAnalyticsConsentForTests,
  setAnalyticsConsent,
} from '@/lib/analyticsConsent';

describe('analytics consent', () => {
  it('starts undecided and persists a choice', () => {
    resetAnalyticsConsentForTests();
    expect(getAnalyticsConsent()).toBeNull();

    setAnalyticsConsent('granted');
    expect(getAnalyticsConsent()).toBe('granted');
    expect(window.localStorage.getItem('ps_analytics_consent')).toBe('granted');

    resetAnalyticsConsentForTests();
    setAnalyticsConsent('denied');
    expect(getAnalyticsConsent()).toBe('denied');
  });
});
