import { env } from '@/config/env';
import { hasAdvertisingConsent } from '@/lib/analyticsConsent';
import {
  disableGoogleAnalytics,
  initGoogleAnalytics,
  isGoogleAnalyticsReady,
  trackGaEvent,
  type GaEventParams,
} from '@/lib/googleAnalytics';
import {
  initMetaPixel,
  isMetaPixelReady,
  isValidMetaPixelId,
  trackCustomEvent,
  trackEvent,
  type MetaEventParams,
  type MetaUserData,
} from '@/lib/metaPixel';
import { isPaidSubscriptionProduct } from '@/lib/plans';
import type { AnalysisStrategy, CheckoutProduct } from '@/models';

export const ANALYTICS_CURRENCY = 'GBP';

const STORAGE_PREFIX = 'ps_meta_';
const PENDING_CHECKOUT_KEY = `${STORAGE_PREFIX}pending_checkout`;
const LEAD_KEY = `${STORAGE_PREFIX}lead`;

export interface PendingCheckout {
  product: CheckoutProduct;
  value?: number;
  contentName?: string;
  sessionId?: string;
}

let lastTrackedPath: string | null = null;
let advertisingDisabled = false;
const completedAnalysisJobs = new Set<string>();

function storageKey(name: string): string {
  return `${STORAGE_PREFIX}${name}`;
}

function readSessionFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    // Private mode or blocked storage should not break the app.
  }
}

function readSessionJson<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeSessionJson(key: string, value: unknown): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage should not break the app.
  }
}

function removeSession(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
}

export function isAdvertisingReady(): boolean {
  return isMetaPixelReady() || isGoogleAnalyticsReady();
}

export function syncAdvertisingAnalytics(userData?: MetaUserData): void {
  if (!hasAdvertisingConsent()) {
    return;
  }
  advertisingDisabled = false;
  if (isValidMetaPixelId(env.metaPixelId)) {
    initMetaPixel(env.metaPixelId, userData);
  }
  initGoogleAnalytics(env.gaMeasurementId);
}

export function disableAdvertisingAnalytics(): void {
  if (advertisingDisabled) {
    return;
  }
  advertisingDisabled = true;
  lastTrackedPath = null;
  disableGoogleAnalytics();
}

export function checkoutEventParams(
  pending: Pick<PendingCheckout, 'product' | 'value' | 'contentName'>,
): MetaEventParams {
  const params: MetaEventParams = {
    content_ids: [pending.product],
    content_name: pending.contentName ?? pending.product,
    content_type: 'product',
    content_category: isPaidSubscriptionProduct(pending.product)
      ? 'subscription'
      : 'credit_pack',
    currency: ANALYTICS_CURRENCY,
    num_items: 1,
  };
  if (typeof pending.value === 'number') {
    params.value = pending.value;
  }
  return params;
}

function gaItemParams(params?: MetaEventParams): GaEventParams {
  const item = {
    item_id: params?.content_ids?.[0],
    item_name: params?.content_name,
    item_category: params?.content_category,
    price: params?.value,
    quantity: params?.num_items,
  };
  const next: GaEventParams = {
    currency: params?.currency,
    value: params?.value,
    item_id: item.item_id,
    item_name: item.item_name,
    item_category: item.item_category,
    method: params?.method,
  };
  if (item.item_id || item.item_name) {
    next.items = [item];
  }
  return next;
}

export function rememberPendingCheckout(pending: PendingCheckout): void {
  writeSessionJson(PENDING_CHECKOUT_KEY, pending);
}

export function peekPendingCheckout(): PendingCheckout | null {
  return readSessionJson<PendingCheckout>(PENDING_CHECKOUT_KEY);
}

export function consumePendingCheckout(): PendingCheckout | null {
  const pending = peekPendingCheckout();
  removeSession(PENDING_CHECKOUT_KEY);
  return pending;
}

export function trackLeadOnce(params?: MetaEventParams): void {
  if (!isAdvertisingReady()) {
    return;
  }
  if (readSessionFlag(LEAD_KEY)) {
    return;
  }
  writeSessionFlag(LEAD_KEY);
  trackEvent('Lead', params);
  trackGaEvent('generate_lead', gaItemParams(params));
}

export function trackCompleteRegistration(method: 'email' | 'google'): void {
  const params: MetaEventParams = {
    content_name: 'property_score_account',
    status: true,
    method,
  };
  trackEvent('CompleteRegistration', params);
  trackGaEvent('sign_up', { method });
}

export function trackStartTrial(): void {
  const params: MetaEventParams = {
    content_name: 'free_plan',
    currency: ANALYTICS_CURRENCY,
    value: 0,
  };
  trackEvent('StartTrial', params);
  trackGaEvent('start_trial', gaItemParams(params));
}

export function trackInitiateCheckout(pending: PendingCheckout): void {
  const params = checkoutEventParams(pending);
  trackEvent('InitiateCheckout', params);
  trackGaEvent('begin_checkout', gaItemParams(params));
}

export function trackPurchaseOnce(input: {
  sessionId?: string;
  pending?: PendingCheckout | null;
}): void {
  const sessionId = input.sessionId?.trim() || input.pending?.sessionId?.trim();
  const dedupeKey = storageKey(`purchase:${sessionId || 'visit'}`);
  if (readSessionFlag(dedupeKey)) {
    return;
  }
  writeSessionFlag(dedupeKey);

  const pending = input.pending ?? null;
  const params = pending
    ? checkoutEventParams(pending)
    : { currency: ANALYTICS_CURRENCY };
  const purchaseEventId = sessionId ? `${sessionId}:purchase` : undefined;
  trackEvent('Purchase', params, purchaseEventId);
  trackGaEvent('purchase', {
    ...gaItemParams(params),
    transaction_id: sessionId,
  });

  if (pending && isPaidSubscriptionProduct(pending.product)) {
    trackEvent(
      'Subscribe',
      params,
      sessionId ? `${sessionId}:subscribe` : undefined,
    );
    trackGaEvent('subscribe', gaItemParams(params));
  }
}

export function trackCheckoutCancelled(pending?: PendingCheckout | null): void {
  const params = pending ? checkoutEventParams(pending) : undefined;
  trackCustomEvent('CheckoutCancelled', params);
  trackGaEvent('checkout_cancelled', gaItemParams(params));
}

export function trackStartAnalysis(strategy: AnalysisStrategy): void {
  const params: MetaEventParams = {
    content_name: strategy,
    content_category: 'analysis',
  };
  trackCustomEvent('StartAnalysis', params);
  trackGaEvent('start_analysis', gaItemParams(params));
}

export function trackAnalysisCompleteOnce(
  jobId: string,
  strategy?: AnalysisStrategy,
): void {
  if (!jobId || completedAnalysisJobs.has(jobId)) {
    return;
  }
  completedAnalysisJobs.add(jobId);
  const params: MetaEventParams = {
    content_name: strategy,
    content_category: 'analysis',
  };
  trackCustomEvent('AnalysisComplete', params);
  trackGaEvent('analysis_complete', gaItemParams(params));
}

export function trackGenerateLayout(schemeId?: string): void {
  const params: MetaEventParams = {
    content_name: schemeId,
    content_category: 'hmo_planner',
  };
  trackCustomEvent('GenerateLayout', params);
  trackGaEvent('generate_layout', gaItemParams(params));
}

export function trackDownloadReport(dealId?: string): void {
  const params: MetaEventParams = {
    content_name: dealId,
    content_category: 'report',
  };
  trackCustomEvent('DownloadReport', params);
  trackGaEvent('download_report', gaItemParams(params));
}

const VIEW_CONTENT_PAGES: Record<
  string,
  Pick<MetaEventParams, 'content_name' | 'content_category'>
> = {
  '/': { content_name: 'landing', content_category: 'marketing' },
  '/pricing': { content_name: 'pricing', content_category: 'marketing' },
  '/login': { content_name: 'login', content_category: 'auth' },
  '/billing': { content_name: 'billing', content_category: 'checkout' },
  '/analyse': { content_name: 'analyse', content_category: 'product' },
  '/deals': { content_name: 'properties', content_category: 'product' },
  '/account': { content_name: 'account', content_category: 'account' },
};

export function viewContentForPath(
  pathname: string,
): Pick<MetaEventParams, 'content_name' | 'content_category'> | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path.startsWith('/deals/') && path !== '/deals') {
    return { content_name: 'deal_report', content_category: 'product' };
  }
  return VIEW_CONTENT_PAGES[path] ?? null;
}

export function trackSpaPageView(pathname: string): void {
  trackEvent('PageView');
  trackGaEvent('page_view', {
    page_path: pathname,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  });
  const content = viewContentForPath(pathname);
  if (content) {
    trackEvent('ViewContent', content);
    trackGaEvent('view_item', gaItemParams(content));
  }
}

export function trackSpaPageViewIfChanged(pathname: string): void {
  if (!isAdvertisingReady()) {
    return;
  }
  if (lastTrackedPath === pathname) {
    return;
  }
  lastTrackedPath = pathname;
  trackSpaPageView(pathname);
}

export function resetAnalyticsPageViewForTests(): void {
  lastTrackedPath = null;
  advertisingDisabled = false;
  completedAnalysisJobs.clear();
}
