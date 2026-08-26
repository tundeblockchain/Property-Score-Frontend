import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCheckout, getBilling, getBillingPlans } from '@/api/billing';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { BillingPage } from '@/pages/BillingPage';
import { buildBillingPlans, buildBillingSummary } from '@/test/factories';
import { theme } from '@/theme/theme';
import { CHECKOUT_PRODUCT, USER_TIER } from '@/lib/plans';
import type { User } from '@/models';

vi.mock('@/api/billing', () => ({
  getBilling: vi.fn(),
  getBillingPlans: vi.fn(),
  createCheckout: vi.fn(),
  createPortal: vi.fn(),
}));

const authValue: AuthContextValue = {
  user: { email: 'investor@example.com' } as User,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue('token'),
};

function renderBillingPage(): void {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <AuthContext.Provider value={authValue}>
              {children}
            </AuthContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  render(<BillingPage />, { wrapper: Wrapper });
}

describe('BillingPage', () => {
  beforeEach(() => {
    vi.mocked(getBilling).mockResolvedValue(buildBillingSummary());
    vi.mocked(getBillingPlans).mockResolvedValue(buildBillingPlans());
    vi.mocked(createCheckout).mockReset();
  });

  it('renders subscription and credit pack catalog from the API', async () => {
    renderBillingPage();

    expect(await screen.findByRole('heading', { name: 'Starter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Current plan' })).toBeDisabled();
    expect(screen.getByText('£39 / month')).toBeInTheDocument();
    expect(screen.getByText('20 listing analyses / month')).toBeInTheDocument();
    expect(screen.getByText('4 analyses left')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '5 extra analyses' })).toBeInTheDocument();
    expect(screen.getByText('£14 one-time')).toBeInTheDocument();
  });

  it('lets a paid starter subscriber choose Pro', async () => {
    vi.mocked(getBilling).mockResolvedValue(
      buildBillingSummary({
        tier: USER_TIER.STARTER,
        stripeSubscriptionId: 'sub_123',
        stripeSubscriptionStatus: 'active',
      }),
    );

    renderBillingPage();

    const currentPlan = await screen.findByRole('button', { name: 'Current plan' });
    expect(currentPlan).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Choose Pro' })).toBeEnabled();
  });

  it('lets a paid pro subscriber choose Starter', async () => {
    vi.mocked(getBilling).mockResolvedValue(
      buildBillingSummary({
        tier: USER_TIER.PRO,
        stripeSubscriptionId: 'sub_456',
        stripeSubscriptionStatus: 'active',
      }),
    );

    renderBillingPage();

    expect(await screen.findByRole('button', { name: 'Current plan' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Choose Starter' })).toBeEnabled();
  });

  it('does not ask for confirmation when a free user chooses a paid plan', async () => {
    const user = userEvent.setup();
    vi.mocked(createCheckout).mockReturnValue(new Promise(() => {}));

    renderBillingPage();
    await user.click(await screen.findByRole('button', { name: 'Choose Starter' }));

    expect(
      screen.queryByRole('heading', { name: 'Switch to Starter?' }),
    ).not.toBeInTheDocument();
    expect(createCheckout).toHaveBeenCalledWith(
      CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION,
    );
  });

  it('asks a Pro subscriber to confirm before switching to Starter', async () => {
    const user = userEvent.setup();
    vi.mocked(getBilling).mockResolvedValue(
      buildBillingSummary({
        tier: USER_TIER.PRO,
        stripeSubscriptionId: 'sub_456',
        stripeSubscriptionStatus: 'active',
      }),
    );
    vi.mocked(createCheckout).mockReturnValue(new Promise(() => {}));

    renderBillingPage();
    await user.click(await screen.findByRole('button', { name: 'Choose Starter' }));

    expect(
      screen.getByRole('heading', { name: 'Switch to Starter?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You'll lose features that are only on your current plan/),
    ).toBeInTheDocument();
    expect(createCheckout).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(
      screen.queryByRole('heading', { name: 'Switch to Starter?' }),
    ).not.toBeInTheDocument();
    expect(createCheckout).not.toHaveBeenCalled();
  });

  it('starts checkout after a Pro subscriber confirms the Starter switch', async () => {
    const user = userEvent.setup();
    vi.mocked(getBilling).mockResolvedValue(
      buildBillingSummary({
        tier: USER_TIER.PRO,
        stripeSubscriptionId: 'sub_456',
        stripeSubscriptionStatus: 'active',
      }),
    );
    vi.mocked(createCheckout).mockReturnValue(new Promise(() => {}));

    renderBillingPage();
    await user.click(await screen.findByRole('button', { name: 'Choose Starter' }));
    await user.click(screen.getByRole('button', { name: 'Switch to Starter' }));

    expect(createCheckout).toHaveBeenCalledWith(
      CHECKOUT_PRODUCT.STARTER_SUBSCRIPTION,
    );
  });

  it('asks a Starter subscriber to confirm before switching to Pro', async () => {
    const user = userEvent.setup();
    vi.mocked(getBilling).mockResolvedValue(
      buildBillingSummary({
        tier: USER_TIER.STARTER,
        stripeSubscriptionId: 'sub_123',
        stripeSubscriptionStatus: 'active',
      }),
    );
    vi.mocked(createCheckout).mockReturnValue(new Promise(() => {}));

    renderBillingPage();
    await user.click(await screen.findByRole('button', { name: 'Choose Pro' }));

    expect(
      screen.getByRole('heading', { name: 'Switch to Pro?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You'll get the extra features on this plan/),
    ).toBeInTheDocument();
    expect(createCheckout).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(
      screen.queryByRole('heading', { name: 'Switch to Pro?' }),
    ).not.toBeInTheDocument();
    expect(createCheckout).not.toHaveBeenCalled();
  });

  it('starts checkout after a Starter subscriber confirms the Pro switch', async () => {
    const user = userEvent.setup();
    vi.mocked(getBilling).mockResolvedValue(
      buildBillingSummary({
        tier: USER_TIER.STARTER,
        stripeSubscriptionId: 'sub_123',
        stripeSubscriptionStatus: 'active',
      }),
    );
    vi.mocked(createCheckout).mockReturnValue(new Promise(() => {}));

    renderBillingPage();
    await user.click(await screen.findByRole('button', { name: 'Choose Pro' }));
    await user.click(screen.getByRole('button', { name: 'Switch to Pro' }));

    expect(createCheckout).toHaveBeenCalledWith(
      CHECKOUT_PRODUCT.PRO_SUBSCRIPTION,
    );
  });
});
