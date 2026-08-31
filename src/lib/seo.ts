import { LANDING_FAQS } from '../content/faqs';

export const SITE_NAME = 'Zola Check';
export const SITE_ORIGIN = 'https://zolacheck.com';
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';
export const DEFAULT_OG_IMAGE_ALT =
  'Zola Check — investor reports for Rightmove, Zoopla and OnTheMarket listings';

export type RobotsDirective = 'index, follow' | 'noindex, nofollow';

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  robots: RobotsDirective;
  jsonLd: Record<string, unknown>;
  noscriptHtml: string;
}

const HOME_TITLE =
  'Zola Check | Score UK listings from Rightmove, Zoopla and OnTheMarket';
const HOME_DESCRIPTION =
  'Paste a Rightmove, Zoopla or OnTheMarket link and get an investor-grade score with yields, HMO licensing, floor plans and area data in seconds. 5 free analyses.';

const PRICING_TITLE = 'Pricing and plans | Zola Check';
const PRICING_DESCRIPTION =
  'Start free with 5 listing analyses. Paid Zola Check plans add more monthly analyses, proposed HMO layouts and PDF reports. Cancel any time.';

const LOGIN_TITLE = 'Sign in | Zola Check';
const LOGIN_DESCRIPTION =
  'Sign in or create a Zola Check account to score Rightmove, Zoopla and OnTheMarket listings for HMO conversion or buy to let.';

const NOT_FOUND_TITLE = 'Page not found | Zola Check';
const NOT_FOUND_DESCRIPTION =
  'This page does not exist. Go back to Zola Check to analyse a UK property listing.';

export function canonicalUrl(path: string): string {
  if (path === '/') {
    return `${SITE_ORIGIN}/`;
  }
  return `${SITE_ORIGIN}${path}`;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

function organizationJsonLd() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: absoluteUrl('/apple-touch-icon.png'),
    description: HOME_DESCRIPTION,
  };
}

function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    inLanguage: 'en-GB',
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  };
}

function softwareJsonLd() {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_ORIGIN}/#app`,
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE_ORIGIN}/`,
    description: HOME_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
      description: 'Free plan includes 5 listing analyses on sign-up.',
    },
    featureList: [
      'Rightmove, Zoopla and OnTheMarket listing analysis',
      'HMO conversion and buy-to-let scoring',
      'Financial model, licensing, floor plans and area data',
    ],
  };
}

function webPageJsonLd(page: {
  path: string;
  title: string;
  description: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${canonicalUrl(page.path)}#webpage`,
    url: canonicalUrl(page.path),
    name: page.title,
    description: page.description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    about: { '@id': `${SITE_ORIGIN}/#app` },
  };
}

function graphJsonLd(
  page: { path: string; title: string; description: string },
  extra: Record<string, unknown>[] = [],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationJsonLd(),
      websiteJsonLd(),
      softwareJsonLd(),
      webPageJsonLd(page),
      ...extra,
    ],
  };
}

function faqJsonLd(): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_ORIGIN}/#faq`,
    mainEntity: LANDING_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function appPage(
  path: string,
  title: string,
  description: string,
): PageSeo {
  return {
    path,
    title,
    description,
    robots: 'noindex, nofollow',
    jsonLd: graphJsonLd({ path, title, description }),
    noscriptHtml: `<p>${escapeHtml(description)}</p>`,
  };
}

export const HOME_SEO: PageSeo = {
  path: '/',
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  robots: 'index, follow',
  jsonLd: graphJsonLd(
    { path: '/', title: HOME_TITLE, description: HOME_DESCRIPTION },
    [faqJsonLd()],
  ),
  noscriptHtml: `
    <article>
      <h1>Score a Rightmove, OnTheMarket, or Zoopla listing in seconds.</h1>
      <p>${escapeHtml(HOME_DESCRIPTION)}</p>
      <p>Paste a listing link and get an investor-grade score with the financial model, compliance checks, floor plan read and area data behind it. 5 free listing analyses on sign-up. No card required.</p>
      <h2>How it works</h2>
      <ol>
        <li>Pick HMO conversion or buy to let, then paste a Rightmove, OnTheMarket, or Zoopla listing link.</li>
        <li>EPC records, planning history, sold comparables, crime, schools, transport, broadband and the listing floor plans are pulled in automatically.</li>
        <li>Read an overall score plus financial, compliance, market demand, location and refurb breakdowns — usually within 15–40 seconds.</li>
      </ol>
      <h2>What is inside a report</h2>
      <ul>
        <li>Financial model — estimated rent, gross yield, annual net cash flow and return on investment.</li>
        <li>Compliance and licensing — HMO licensing paths, local authority scheme checks and a fire escape assessment.</li>
        <li>Floor plan intelligence — room detection, space standards and extension potential.</li>
        <li>Area enrichment — EPC, planning, sold prices, crime, schools, transport and broadband.</li>
        <li>HMO planner — conversion schemes, refurb bill of quantities and money comparisons.</li>
        <li>Shareable PDF report for partners, brokers or lenders.</li>
      </ul>
      <h2>Questions, answered</h2>
      <dl>
        ${LANDING_FAQS.map(
          (faq) =>
            `<dt>${escapeHtml(faq.question)}</dt><dd>${escapeHtml(faq.answer)}</dd>`,
        ).join('')}
      </dl>
      <p><a href="${SITE_ORIGIN}/pricing">Compare plans</a> · <a href="${SITE_ORIGIN}/login">Sign in</a></p>
    </article>
  `.trim(),
};

export const PRICING_SEO: PageSeo = {
  path: '/pricing',
  title: PRICING_TITLE,
  description: PRICING_DESCRIPTION,
  robots: 'index, follow',
  jsonLd: graphJsonLd({
    path: '/pricing',
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
  }),
  noscriptHtml: `
    <article>
      <h1>Pricing</h1>
      <p>${escapeHtml(PRICING_DESCRIPTION)}</p>
      <p>Each listing uses one analysis. Proposed layouts use three analyses from the same balance. Top-up packs never expire while your account is active. Payments are handled by Stripe; you can upgrade, downgrade or cancel any time.</p>
      <p><a href="${SITE_ORIGIN}/">Score a listing</a> · <a href="${SITE_ORIGIN}/login">Start free</a></p>
    </article>
  `.trim(),
};

export const LOGIN_SEO: PageSeo = {
  path: '/login',
  title: LOGIN_TITLE,
  description: LOGIN_DESCRIPTION,
  robots: 'index, follow',
  jsonLd: graphJsonLd({
    path: '/login',
    title: LOGIN_TITLE,
    description: LOGIN_DESCRIPTION,
  }),
  noscriptHtml: `
    <article>
      <h1>Sign in to Zola Check</h1>
      <p>${escapeHtml(LOGIN_DESCRIPTION)}</p>
      <p><a href="${SITE_ORIGIN}/">Back to home</a></p>
    </article>
  `.trim(),
};

export const NOT_FOUND_SEO: PageSeo = {
  path: '/404',
  title: NOT_FOUND_TITLE,
  description: NOT_FOUND_DESCRIPTION,
  robots: 'noindex, nofollow',
  jsonLd: graphJsonLd({
    path: '/404',
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
  }),
  noscriptHtml: `
    <article>
      <h1>Page not found</h1>
      <p>${escapeHtml(NOT_FOUND_DESCRIPTION)}</p>
      <p><a href="${SITE_ORIGIN}/">Go to Zola Check</a></p>
    </article>
  `.trim(),
};

const APP_PAGES: PageSeo[] = [
  appPage(
    '/analyse',
    'Analyse a listing | Zola Check',
    'Paste a Rightmove, OnTheMarket or Zoopla URL and choose HMO conversion or buy to let.',
  ),
  appPage(
    '/deals',
    'Your properties | Zola Check',
    'Your recent Zola Check listing analyses.',
  ),
  appPage(
    '/deals/:dealId',
    'Property report | Zola Check',
    'Private Zola Check investment report.',
  ),
  appPage(
    '/billing',
    'Billing | Zola Check',
    'Manage your Zola Check plan, analyses and top-ups.',
  ),
  appPage(
    '/billing/success',
    'Payment successful | Zola Check',
    'Your Zola Check payment was successful.',
  ),
  appPage(
    '/billing/cancel',
    'Checkout cancelled | Zola Check',
    'Zola Check checkout was cancelled. No charge was made.',
  ),
  appPage(
    '/account',
    'Account | Zola Check',
    'Manage your Zola Check account, testimonials and support messages.',
  ),
];

/** Public routes that get their own built HTML shell for crawlers. */
export const PUBLIC_HTML_PAGES: PageSeo[] = [HOME_SEO, PRICING_SEO, LOGIN_SEO];

export function resolvePageSeo(pathname: string): PageSeo {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/') {
    return HOME_SEO;
  }
  if (path === '/pricing') {
    return PRICING_SEO;
  }
  if (path === '/login') {
    return LOGIN_SEO;
  }

  const exactAppPage = APP_PAGES.find((page) => page.path === path);
  if (exactAppPage) {
    return exactAppPage;
  }

  if (path.startsWith('/deals/')) {
    return APP_PAGES.find((page) => page.path === '/deals/:dealId') ?? NOT_FOUND_SEO;
  }

  return {
    ...NOT_FOUND_SEO,
    path,
    jsonLd: graphJsonLd({
      path,
      title: NOT_FOUND_TITLE,
      description: NOT_FOUND_DESCRIPTION,
    }),
  };
}

const SEO_HEAD_START = '<!--seo-head-->';
const SEO_HEAD_END = '<!--/seo-head-->';

export function renderSeoHead(page: PageSeo, domainVerification = ''): string {
  const url = canonicalUrl(page.path);
  const image = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const robots = escapeHtml(page.robots);
  const verification = domainVerification.trim();
  const domainVerificationTag = verification
    ? `\n    <meta name="facebook-domain-verification" content="${escapeHtml(verification)}" />`
    : '';

  return `${SEO_HEAD_START}
    <title>${title}</title>
    <meta name="description" content="${description}" />${domainVerificationTag}
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <meta name="application-name" content="${escapeHtml(SITE_NAME)}" />
    <meta name="apple-mobile-web-app-title" content="${escapeHtml(SITE_NAME)}" />
    <meta name="theme-color" content="#0F766E" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en-GB" href="${url}" />
    <link rel="alternate" hreflang="x-default" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${escapeHtml(DEFAULT_OG_IMAGE_ALT)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escapeHtml(DEFAULT_OG_IMAGE_ALT)}" />
    ${SEO_HEAD_END}`;
}

export function applySeoPlaceholders(
  html: string,
  page: PageSeo,
  domainVerification = '',
): string {
  const head = renderSeoHead(page, domainVerification);
  const jsonLd = JSON.stringify(page.jsonLd);
  const noscript = page.noscriptHtml;

  let next = html.replace(
    new RegExp(`${SEO_HEAD_START}[\\s\\S]*?${SEO_HEAD_END}`),
    head,
  );
  next = next.replace(
    /<script type="application\/ld\+json" id="json-ld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="json-ld">${jsonLd}</script>`,
  );
  next = next.replace(
    /<noscript id="seo-noscript">[\s\S]*?<\/noscript>/,
    `<noscript id="seo-noscript">${noscript}</noscript>`,
  );
  return next;
}
