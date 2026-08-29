import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initGoogleAnalytics,
  isValidGaMeasurementId,
  resetGoogleAnalyticsForTests,
  trackGaEvent,
} from '@/lib/googleAnalytics';

const MEASUREMENT_ID = 'G-TEST1234';

describe('google analytics transport', () => {
  beforeEach(() => {
    resetGoogleAnalyticsForTests();
  });

  afterEach(() => {
    resetGoogleAnalyticsForTests();
  });

  it('accepts GA4 measurement IDs only', () => {
    expect(isValidGaMeasurementId(MEASUREMENT_ID)).toBe(true);
    expect(isValidGaMeasurementId('UA-123')).toBe(false);
    expect(isValidGaMeasurementId('')).toBe(false);
  });

  it('does not load the script without a valid measurement ID', () => {
    initGoogleAnalytics('');
    trackGaEvent('page_view');
    expect(document.getElementById('ga-gtag-script')).toBeNull();
    expect(window.gtag).toBeUndefined();
  });

  it('initialises gtag and sends events', () => {
    initGoogleAnalytics(MEASUREMENT_ID);
    const gtag = vi.fn();
    window.gtag = gtag;

    trackGaEvent('sign_up', { method: 'email' });

    expect(document.getElementById('ga-gtag-script')).toHaveAttribute(
      'src',
      `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`,
    );
    expect(gtag).toHaveBeenCalledWith('event', 'sign_up', { method: 'email' });
  });
});
