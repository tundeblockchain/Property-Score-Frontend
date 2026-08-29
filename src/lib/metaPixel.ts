export const META_PIXEL_CURRENCY = 'GBP';

const SCRIPT_ID = 'meta-pixel-script';
const PIXEL_SCRIPT_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

export type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'CompleteRegistration'
  | 'StartTrial'
  | 'InitiateCheckout'
  | 'Subscribe'
  | 'Purchase';

export type MetaCustomEvent =
  | 'StartAnalysis'
  | 'AnalysisComplete'
  | 'GenerateLayout'
  | 'DownloadReport'
  | 'CheckoutCancelled';

export interface MetaUserData {
  em?: string;
  external_id?: string;
}

export interface MetaEventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  currency?: string;
  value?: number;
  num_items?: number;
  status?: boolean;
  method?: string;
}

type FbqArgs = unknown[];

interface FacebookPixelFn {
  (...args: FbqArgs): void;
  callMethod?: (...args: FbqArgs) => void;
  queue: FbqArgs[];
  loaded: boolean;
  version: string;
  push: FacebookPixelFn;
}

declare global {
  interface Window {
    fbq?: FacebookPixelFn;
    _fbq?: FacebookPixelFn;
  }
}

let initializedPixelId: string | null = null;

export function isValidMetaPixelId(pixelId: string): boolean {
  return /^\d{5,20}$/.test(pixelId);
}

function installFbqStub(): FacebookPixelFn {
  if (window.fbq) {
    return window.fbq;
  }

  const fbq = function (...args: FbqArgs): void {
    const pixel = fbq as FacebookPixelFn;
    if (pixel.callMethod) {
      pixel.callMethod(...args);
    } else {
      pixel.queue.push(args);
    }
  } as FacebookPixelFn;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;
  return fbq;
}

function loadPixelScript(): void {
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = PIXEL_SCRIPT_SRC;
  document.head.appendChild(script);
}

function sanitizeUserData(userData?: MetaUserData): MetaUserData | undefined {
  if (!userData) {
    return undefined;
  }
  const em = userData.em?.trim().toLowerCase();
  const externalId = userData.external_id?.trim();
  const next: MetaUserData = {};
  if (em) {
    next.em = em;
  }
  if (externalId) {
    next.external_id = externalId;
  }
  return next.em || next.external_id ? next : undefined;
}

function getFbq(): FacebookPixelFn | null {
  if (!initializedPixelId || typeof window === 'undefined') {
    return null;
  }
  return window.fbq ?? null;
}

export function initMetaPixel(pixelId: string, userData?: MetaUserData): void {
  if (typeof window === 'undefined' || !isValidMetaPixelId(pixelId)) {
    return;
  }

  const fbq = installFbqStub();
  loadPixelScript();
  const matching = sanitizeUserData(userData);

  if (initializedPixelId !== pixelId) {
    initializedPixelId = pixelId;
    if (matching) {
      fbq('init', pixelId, matching);
    } else {
      fbq('init', pixelId);
    }
    return;
  }

  if (matching) {
    fbq('init', pixelId, matching);
  }
}

export function isMetaPixelReady(): boolean {
  return initializedPixelId != null;
}

export function trackEvent(
  event: MetaStandardEvent,
  params?: MetaEventParams,
  eventId?: string,
): void {
  const fbq = getFbq();
  if (!fbq) {
    return;
  }
  if (eventId) {
    fbq('track', event, params ?? {}, { eventID: eventId });
    return;
  }
  fbq('track', event, params ?? {});
}

export function trackCustomEvent(
  event: MetaCustomEvent,
  params?: MetaEventParams,
): void {
  const fbq = getFbq();
  if (!fbq) {
    return;
  }
  fbq('trackCustom', event, params ?? {});
}

export function resetMetaPixelForTests(): void {
  initializedPixelId = null;
  if (typeof window !== 'undefined') {
    delete window.fbq;
    delete window._fbq;
    document.getElementById(SCRIPT_ID)?.remove();
  }
}
