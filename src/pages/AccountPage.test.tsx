import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearDeals, deleteAccount } from '@/api/account';
import { getBilling } from '@/api/billing';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { AccountPage } from '@/pages/AccountPage';
import { buildBillingSummary } from '@/test/factories';
import { theme } from '@/theme/theme';
import type { User } from '@/models';

vi.mock('@/api/billing', () => ({
  getBilling: vi.fn(),
  createCheckout: vi.fn(),
  createPortal: vi.fn(),
}));

vi.mock('@/api/account', () => ({
  clearDeals: vi.fn(),
  deleteAccount: vi.fn(),
}));

const signOut = vi.fn().mockResolvedValue(undefined);

const authValue: AuthContextValue = {
  user: { email: 'investor@example.com' } as User,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut,
  getIdToken: vi.fn().mockResolvedValue('token'),
};

function renderAccountPage(): void {
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
          <MemoryRouter initialEntries={['/account']}>
            <AuthContext.Provider value={authValue}>
              <Routes>
                <Route path="/account" element={children} />
                <Route path="/" element={<div>Home</div>} />
                <Route path="/billing" element={<div>Billing</div>} />
              </Routes>
            </AuthContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  render(<AccountPage />, { wrapper: Wrapper });
}

describe('AccountPage', () => {
  beforeEach(() => {
    vi.mocked(getBilling).mockResolvedValue(buildBillingSummary());
    vi.mocked(clearDeals).mockResolvedValue({ deletedCount: 2 });
    vi.mocked(deleteAccount).mockResolvedValue({ deleted: true });
    signOut.mockClear();
  });

  it('shows account details and subscription actions', async () => {
    renderAccountPage();

    expect(
      await screen.findByRole('heading', { name: 'Account' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/investor@example.com/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Choose a plan' }),
    ).toHaveAttribute('href', '/billing');
    expect(
      screen.getByRole('button', { name: 'Clear all properties' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete account' }),
    ).toBeInTheDocument();
  });

  it('shows the Stripe portal action when the user has a subscription', async () => {
    vi.mocked(getBilling).mockResolvedValue(
      buildBillingSummary({
        tier: 'STARTER',
        stripeSubscriptionId: 'sub_123',
        stripeSubscriptionStatus: 'active',
        monthlyAllowance: 25,
      }),
    );

    renderAccountPage();

    expect(
      await screen.findByRole('button', { name: 'Manage subscription' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View plans' }),
    ).toHaveAttribute('href', '/billing');
  });

  it('clears all properties after confirmation', async () => {
    const user = userEvent.setup();
    renderAccountPage();

    await screen.findByRole('heading', { name: 'Account' });
    await user.click(screen.getByRole('button', { name: 'Clear all properties' }));

    const dialog = screen.getByRole('dialog');
    await user.click(
      within(dialog).getByRole('button', { name: 'Clear all properties' }),
    );

    expect(clearDeals).toHaveBeenCalledOnce();
    expect(
      await screen.findByText('Deleted 2 properties.'),
    ).toBeInTheDocument();
  });

  it('deletes the account after the email is confirmed', async () => {
    const user = userEvent.setup();
    renderAccountPage();

    await screen.findByRole('heading', { name: 'Account' });
    await user.click(screen.getByRole('button', { name: 'Delete account' }));

    const dialog = screen.getByRole('dialog');
    const confirmButton = within(dialog).getByRole('button', {
      name: 'Delete account',
    });
    expect(confirmButton).toBeDisabled();

    await user.type(
      within(dialog).getByLabelText('Type investor@example.com to confirm'),
      'investor@example.com',
    );
    await user.click(confirmButton);

    expect(deleteAccount).toHaveBeenCalledOnce();
    expect(signOut).toHaveBeenCalledOnce();
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });
});
