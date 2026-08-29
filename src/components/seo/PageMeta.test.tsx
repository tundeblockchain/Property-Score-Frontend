import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PageMeta } from '@/components/seo/PageMeta';
import { LOGIN_SEO, PRICING_SEO, SITE_ORIGIN } from '@/lib/seo';

function renderPageMeta(path: string): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <PageMeta />
    </MemoryRouter>,
  );
}

describe('PageMeta', () => {
  it('renders the route title, robots tag and canonical URL', () => {
    renderPageMeta('/login');

    expect(document.title).toBe(LOGIN_SEO.title);
    expect(
      document.head.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ).toBe('index, follow');
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe(`${SITE_ORIGIN}/login`);
  });

  it('switches metadata when the route is pricing', () => {
    renderPageMeta('/pricing');

    expect(document.title).toBe(PRICING_SEO.title);
    expect(
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute('content'),
    ).toBe(PRICING_SEO.description);
    expect(
      document.querySelector('script[type="application/ld+json"]')
        ?.textContent,
    ).toContain(`${SITE_ORIGIN}/pricing`);
  });
});
