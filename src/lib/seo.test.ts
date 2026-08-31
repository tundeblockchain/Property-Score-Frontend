import { describe, expect, it } from 'vitest';
import {
  HOME_SEO,
  LOGIN_SEO,
  NOT_FOUND_SEO,
  PRICING_SEO,
  SITE_NAME,
  SITE_ORIGIN,
  applySeoPlaceholders,
  canonicalUrl,
  resolvePageSeo,
} from '@/lib/seo';

describe('site brand', () => {
  it('uses the public Zola Check domain', () => {
    expect(SITE_NAME).toBe('Zola Check');
    expect(SITE_ORIGIN).toBe('https://zolacheck.com');
  });
});

describe('canonicalUrl', () => {
  it('uses a trailing slash only on the homepage', () => {
    expect(canonicalUrl('/')).toBe(`${SITE_ORIGIN}/`);
    expect(canonicalUrl('/pricing')).toBe(`${SITE_ORIGIN}/pricing`);
  });
});

describe('resolvePageSeo', () => {
  it('returns indexable marketing pages', () => {
    expect(resolvePageSeo('/')).toEqual(HOME_SEO);
    expect(resolvePageSeo('/pricing/')).toEqual(PRICING_SEO);
    expect(resolvePageSeo('/login')).toEqual(LOGIN_SEO);
    expect(HOME_SEO.robots).toBe('index, follow');
    expect(PRICING_SEO.robots).toBe('index, follow');
  });

  it('keeps signed-in app routes out of the public index', () => {
    expect(resolvePageSeo('/analyse').robots).toBe('noindex, nofollow');
    expect(resolvePageSeo('/deals').robots).toBe('noindex, nofollow');
    expect(resolvePageSeo('/deals/abc-123').robots).toBe('noindex, nofollow');
    expect(resolvePageSeo('/billing').robots).toBe('noindex, nofollow');
    expect(resolvePageSeo('/account').robots).toBe('noindex, nofollow');
  });

  it('treats unknown paths as a noindex 404', () => {
    const page = resolvePageSeo('/does-not-exist');
    expect(page.title).toBe(NOT_FOUND_SEO.title);
    expect(page.robots).toBe('noindex, nofollow');
    expect(page.path).toBe('/does-not-exist');
  });

  it('embeds FAQ structured data on the homepage', () => {
    const graph = HOME_SEO.jsonLd['@graph'] as Array<{ '@type': string }>;
    expect(graph.some((node) => node['@type'] === 'FAQPage')).toBe(true);
  });
});

describe('applySeoPlaceholders', () => {
  const template = `<!doctype html>
<html>
  <head>
    <!--seo-head-->
    <title>Placeholder</title>
    <!--/seo-head-->
    <script type="application/ld+json" id="json-ld">{}</script>
  </head>
  <body>
    <noscript id="seo-noscript">fallback</noscript>
  </body>
</html>`;

  it('writes route-specific title, description, canonical and JSON-LD', () => {
    const html = applySeoPlaceholders(template, PRICING_SEO);

    expect(html).toContain(`<title>${PRICING_SEO.title}</title>`);
    expect(html).toContain(`content="${PRICING_SEO.description}"`);
    expect(html).toContain(`href="${SITE_ORIGIN}/pricing"`);
    expect(html).not.toContain('"@type":"FAQPage"');
    expect(html).toContain(PRICING_SEO.noscriptHtml.slice(0, 40));
    const jsonLd = JSON.parse(
      html.match(
        /<script type="application\/ld\+json" id="json-ld">([\s\S]*?)<\/script>/,
      )?.[1] ?? '{}',
    ) as { '@graph': Array<{ '@type': string; url?: string }> };
    const webPage = jsonLd['@graph'].find((node) => node['@type'] === 'WebPage');
    expect(webPage?.url).toBe(`${SITE_ORIGIN}/pricing`);
  });

  it('embeds Meta domain verification when a token is supplied', () => {
    const html = applySeoPlaceholders(template, HOME_SEO, 'abc123');
    expect(html).toContain(
      'name="facebook-domain-verification" content="abc123"',
    );
  });
});
