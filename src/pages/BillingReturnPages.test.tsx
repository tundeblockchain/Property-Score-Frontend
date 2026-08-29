import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import {
  BillingCancelPage,
  BillingSuccessPage,
} from '@/pages/BillingReturnPages';
import { theme } from '@/theme/theme';

const consumePendingCheckout = vi.fn();
const trackPurchaseOnce = vi.fn();
const trackCheckoutCancelled = vi.fn();

vi.mock('@/lib/analytics', () => ({
  consumePendingCheckout: (...args: unknown[]) => consumePendingCheckout(...args),
  trackPurchaseOnce: (...args: unknown[]) => trackPurchaseOnce(...args),
  trackCheckoutCancelled: (...args: unknown[]) =>
    trackCheckoutCancelled(...args),
}));

const authValue: AuthContextValue = {
  user: null,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue(null),
};

function renderReturn(path: string, page: ReactNode): void {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[path]}>
          <AuthContext.Provider value={authValue}>
            <Routes>
              <Route path="/billing/success" element={page} />
              <Route path="/billing/cancel" element={page} />
            </Routes>
          </AuthContext.Provider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('billing return pages', () => {
  beforeEach(() => {
    consumePendingCheckout.mockReset();
    trackPurchaseOnce.mockClear();
    trackCheckoutCancelled.mockClear();
  });

  it('fires a deduped Purchase when Stripe returns a session', () => {
    consumePendingCheckout.mockReturnValue({
      product: 'starter_subscription',
      value: 39,
      contentName: 'Starter',
      sessionId: 'cs_test',
    });

    renderReturn('/billing/success?session_id=cs_test', <BillingSuccessPage />);

    expect(screen.getByRole('heading', { name: 'Payment successful' })).toBeInTheDocument();
    expect(trackPurchaseOnce).toHaveBeenCalledWith({
      sessionId: 'cs_test',
      pending: {
        product: 'starter_subscription',
        value: 39,
        contentName: 'Starter',
        sessionId: 'cs_test',
      },
    });
  });

  it('records a cancelled checkout so the funnel can drop off', () => {
    consumePendingCheckout.mockReturnValue({
      product: 'pro_subscription',
      value: 99,
      contentName: 'Pro',
    });

    renderReturn('/billing/cancel', <BillingCancelPage />);

    expect(
      screen.getByRole('heading', { name: 'Checkout cancelled' }),
    ).toBeInTheDocument();
    expect(trackCheckoutCancelled).toHaveBeenCalledWith({
      product: 'pro_subscription',
      value: 99,
      contentName: 'Pro',
    });
  });
});
