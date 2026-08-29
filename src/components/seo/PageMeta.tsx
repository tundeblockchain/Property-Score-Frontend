import { useLocation } from 'react-router-dom';
import { env } from '@/config/env';
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  SITE_NAME,
  absoluteUrl,
  canonicalUrl,
  resolvePageSeo,
} from '@/lib/seo';

export function PageMeta() {
  const { pathname } = useLocation();
  const page = resolvePageSeo(pathname);
  const url = canonicalUrl(page.path);
  const image = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const jsonLd = JSON.stringify(page.jsonLd).replaceAll('<', '\\u003c');

  return (
    <>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      {env.metaDomainVerification ? (
        <meta
          name="facebook-domain-verification"
          content={env.metaDomainVerification}
        />
      ) : null}
      <meta name="robots" content={page.robots} />
      <meta name="googlebot" content={page.robots} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="theme-color" content="#0F766E" />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en-GB" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={DEFAULT_OG_IMAGE_ALT} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={DEFAULT_OG_IMAGE_ALT} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </>
  );
}
