export const GA_CURRENCY = 'GBP';

const SCRIPT_ID = 'ga-gtag-script';

export type GaEventName =
  | 'page_view'
  | 'view_item'
  | 'generate_lead'
  | 'sign_up'
  | 'begin_checkout'
  | 'purchase'
  | 'start_trial'
  | 'subscribe'
  | 'start_analysis'
  | 'analysis_complete'
  | 'generate_layout'
  | 'download_report'
  | 'checkout_cancelled';

export interface GaEventParams {
  page_path?: string;
  page_location?: string;
  page_title?: string;
  method?: string;
  currency?: string;
  value?: number;
  transaction_id?: string;
  item_id?: string;
  item_name?: string;
  item_category?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    item_category?: string;
    price?: number;
    quantity?: number;
  }>;
}

type GtagArgs = unknown[];

type GtagFn = (...args: GtagArgs) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

let initializedMeasurementId: string | null = null;

export function isValidGaMeasurementId(measurementId: string): boolean {
  return /^G-[A-Z0-9]+$/.test(measurementId);
}

function installGtagStub(): GtagFn {
  if (window.gtag) {
    return window.gtag;
  }
  window.dataLayer = window.dataLayer ?? [];
  const gtag: GtagFn = (...args: GtagArgs) => {
    window.dataLayer?.push(args);
  };
  window.gtag = gtag;
  return gtag;
}

function loadGtagScript(measurementId: string): void {
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

function getGtag(): GtagFn | null {
  if (!initializedMeasurementId || typeof window === 'undefined') {
    return null;
  }
  return window.gtag ?? null;
}

export function initGoogleAnalytics(measurementId: string): void {
  if (typeof window === 'undefined' || !isValidGaMeasurementId(measurementId)) {
    return;
  }

  const gtag = installGtagStub();
  loadGtagScript(measurementId);

  if (initializedMeasurementId === measurementId) {
    return;
  }

  initializedMeasurementId = measurementId;
  gtag('js', new Date());
  gtag('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
  gtag('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  });
}

export function isGoogleAnalyticsReady(): boolean {
  return initializedMeasurementId != null;
}

export function trackGaEvent(name: GaEventName, params?: GaEventParams): void {
  const gtag = getGtag();
  if (!gtag) {
    return;
  }
  gtag('event', name, params ?? {});
}

export function disableGoogleAnalytics(): void {
  const gtag = getGtag();
  if (!gtag) {
    return;
  }
  gtag('consent', 'update', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export function resetGoogleAnalyticsForTests(): void {
  initializedMeasurementId = null;
  if (typeof window !== 'undefined') {
    delete window.gtag;
    delete window.dataLayer;
    document.getElementById(SCRIPT_ID)?.remove();
  }
}
