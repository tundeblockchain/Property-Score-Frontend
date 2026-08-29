import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { CookieConsentBanner } from '@/components/analytics/CookieConsentBanner';
import {
  getAnalyticsConsent,
  resetAnalyticsConsentForTests,
} from '@/lib/analyticsConsent';
import { theme } from '@/theme/theme';

function renderBanner(forceOpen = false): void {
  render(
    <ThemeProvider theme={theme}>
      <CookieConsentBanner forceOpen={forceOpen} />
    </ThemeProvider>,
  );
}

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    resetAnalyticsConsentForTests();
  });

  it('asks for analytics and ads consent', () => {
    renderBanner();

    expect(
      screen.getByRole('dialog', { name: 'Cookies for analytics and ads' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Accept' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reject' }),
    ).toBeInTheDocument();
  });

  it('stores acceptance and hides the banner', async () => {
    const user = userEvent.setup();
    renderBanner();

    await user.click(screen.getByRole('button', { name: 'Accept' }));

    expect(getAnalyticsConsent()).toBe('granted');
    expect(
      screen.queryByRole('dialog', { name: 'Cookies for analytics and ads' }),
    ).not.toBeInTheDocument();
  });

  it('stores a rejection and can be reopened from cookie settings', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <CookieConsentBanner />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(getAnalyticsConsent()).toBe('denied');
    expect(
      screen.queryByRole('dialog', { name: 'Cookies for analytics and ads' }),
    ).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <CookieConsentBanner forceOpen />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole('dialog', { name: 'Cookies for analytics and ads' }),
    ).toBeInTheDocument();
  });
});
