import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initMetaPixel,
  isValidMetaPixelId,
  resetMetaPixelForTests,
  trackCustomEvent,
  trackEvent,
} from '@/lib/metaPixel';

const PIXEL_ID = '123456789012345';

describe('meta pixel transport', () => {
  beforeEach(() => {
    resetMetaPixelForTests();
  });

  afterEach(() => {
    resetMetaPixelForTests();
  });

  it('accepts numeric Meta pixel IDs only', () => {
    expect(isValidMetaPixelId(PIXEL_ID)).toBe(true);
    expect(isValidMetaPixelId('')).toBe(false);
    expect(isValidMetaPixelId('not-a-pixel')).toBe(false);
  });

  it('does not load the script or send events without a valid pixel ID', () => {
    initMetaPixel('');
    trackEvent('PageView');
    expect(document.getElementById('meta-pixel-script')).toBeNull();
    expect(window.fbq).toBeUndefined();
  });

  it('initialises the pixel and queues events', () => {
    initMetaPixel(PIXEL_ID, { em: 'Investor@Example.com', external_id: 'uid_1' });
    const fbq = vi.fn();
    window.fbq = Object.assign(fbq, window.fbq);

    trackEvent('PageView');
    trackCustomEvent('StartAnalysis', { content_name: 'hmo' });

    expect(document.getElementById('meta-pixel-script')).toHaveAttribute(
      'src',
      'https://connect.facebook.net/en_US/fbevents.js',
    );
    expect(fbq).toHaveBeenCalledWith('track', 'PageView', {});
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'StartAnalysis', {
      content_name: 'hmo',
    });
  });
});
