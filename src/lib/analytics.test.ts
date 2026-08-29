import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkoutEventParams,
  consumePendingCheckout,
  rememberPendingCheckout,
  resetAnalyticsPageViewForTests,
  trackAnalysisCompleteOnce,
  trackCheckoutCancelled,
  trackCompleteRegistration,
  trackInitiateCheckout,
  trackLeadOnce,
  trackPurchaseOnce,
  trackSpaPageView,
  trackSpaPageViewIfChanged,
  trackStartTrial,
  viewContentForPath,
} from '@/lib/analytics';
import { initGoogleAnalytics, resetGoogleAnalyticsForTests } from '@/lib/googleAnalytics';
import { initMetaPixel, resetMetaPixelForTests } from '@/lib/metaPixel';

const PIXEL_ID = '123456789012345';
const MEASUREMENT_ID = 'G-TEST1234';

function stubSinks() {
  const fbq = vi.fn();
  const gtag = vi.fn();
  window.fbq = Object.assign(fbq, window.fbq);
  window.gtag = gtag;
  return { fbq, gtag };
}

describe('acquisition analytics', () => {
  beforeEach(() => {
    resetMetaPixelForTests();
    resetGoogleAnalyticsForTests();
    resetAnalyticsPageViewForTests();
    window.sessionStorage.clear();
    initMetaPixel(PIXEL_ID);
    initGoogleAnalytics(MEASUREMENT_ID);
  });

  afterEach(() => {
    resetMetaPixelForTests();
    resetGoogleAnalyticsForTests();
    resetAnalyticsPageViewForTests();
    window.sessionStorage.clear();
  });

  it('maps acquisition and product pages for ViewContent', () => {
    expect(viewContentForPath('/')).toEqual({
      content_name: 'landing',
      content_category: 'marketing',
    });
    expect(viewContentForPath('/deals/abc-123')).toEqual({
      content_name: 'deal_report',
      content_category: 'product',
    });
    expect(viewContentForPath('/billing/success')).toBeNull();
  });

  it('sends page views to Meta and Google once per path', () => {
    const { fbq, gtag } = stubSinks();

    trackSpaPageViewIfChanged('/pricing');
    trackSpaPageViewIfChanged('/pricing');

    expect(fbq).toHaveBeenCalledWith('track', 'PageView', {});
    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', {
      content_name: 'pricing',
      content_category: 'marketing',
    });
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({ page_path: '/pricing' }),
    );
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'view_item',
      expect.objectContaining({ item_name: 'pricing' }),
    );
    expect(fbq.mock.calls.filter((call) => call[1] === 'PageView')).toHaveLength(1);
  });

  it('fires Lead only once per session on both sinks', () => {
    const { fbq, gtag } = stubSinks();

    trackLeadOnce({ content_name: 'sign_up' });
    trackLeadOnce({ content_name: 'sign_up' });

    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('track', 'Lead', { content_name: 'sign_up' });
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'generate_lead',
      expect.objectContaining({ item_name: 'sign_up' }),
    );
  });

  it('sends registration and trial events to both sinks', () => {
    const { fbq, gtag } = stubSinks();
    trackCompleteRegistration('email');
    trackStartTrial();

    expect(fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', {
      content_name: 'property_score_account',
      status: true,
      method: 'email',
    });
    expect(gtag).toHaveBeenCalledWith('event', 'sign_up', { method: 'email' });
    expect(fbq).toHaveBeenCalledWith('track', 'StartTrial', {
      content_name: 'free_plan',
      currency: 'GBP',
      value: 0,
    });
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'start_trial',
      expect.objectContaining({ item_name: 'free_plan', value: 0 }),
    );
  });

  it('stores checkout details and sends InitiateCheckout', () => {
    const { fbq, gtag } = stubSinks();
    const pending = {
      product: 'pro_subscription' as const,
      value: 99,
      contentName: 'Pro',
      sessionId: 'cs_test',
    };
    rememberPendingCheckout(pending);
    trackInitiateCheckout(pending);

    expect(consumePendingCheckout()).toEqual(pending);
    expect(consumePendingCheckout()).toBeNull();
    expect(fbq).toHaveBeenCalledWith(
      'track',
      'InitiateCheckout',
      checkoutEventParams(pending),
    );
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'begin_checkout',
      expect.objectContaining({ value: 99, item_name: 'Pro' }),
    );
  });

  it('sends Purchase and Subscribe once for a subscription return', () => {
    const { fbq, gtag } = stubSinks();
    const pending = {
      product: 'starter_subscription' as const,
      value: 39,
      contentName: 'Starter',
      sessionId: 'cs_abc',
    };

    trackPurchaseOnce({ sessionId: 'cs_abc', pending });
    trackPurchaseOnce({ sessionId: 'cs_abc', pending });

    expect(fbq).toHaveBeenCalledWith(
      'track',
      'Purchase',
      checkoutEventParams(pending),
      { eventID: 'cs_abc:purchase' },
    );
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'purchase',
      expect.objectContaining({ transaction_id: 'cs_abc', value: 39 }),
    );
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'subscribe',
      expect.objectContaining({ item_name: 'Starter' }),
    );
    expect(fbq.mock.calls.filter((call) => call[1] === 'Purchase')).toHaveLength(1);
  });

  it('sends only Purchase for credit packs and tracks cancelled checkout', () => {
    const { fbq, gtag } = stubSinks();
    const pending = {
      product: 'credits_15' as const,
      value: 29,
      contentName: '15 extra analyses',
    };
    trackPurchaseOnce({ sessionId: 'cs_pack', pending });
    trackCheckoutCancelled(pending);

    expect(gtag.mock.calls.some((call) => call[1] === 'subscribe')).toBe(false);
    expect(fbq).toHaveBeenCalledWith(
      'trackCustom',
      'CheckoutCancelled',
      checkoutEventParams(pending),
    );
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'checkout_cancelled',
      expect.objectContaining({ item_name: '15 extra analyses' }),
    );
  });

  it('deduplicates analysis completion by job id', () => {
    const { fbq } = stubSinks();
    trackAnalysisCompleteOnce('deal_1', 'hmo');
    trackAnalysisCompleteOnce('deal_1', 'hmo');
    expect(
      fbq.mock.calls.filter((call) => call[1] === 'AnalysisComplete'),
    ).toHaveLength(1);
  });

  it('does not send a page view until a sink is ready', () => {
    resetMetaPixelForTests();
    resetGoogleAnalyticsForTests();
    const { fbq, gtag } = stubSinks();
    trackSpaPageViewIfChanged('/pricing');
    expect(fbq).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
    expect(trackSpaPageView).toBeTypeOf('function');
  });
});
