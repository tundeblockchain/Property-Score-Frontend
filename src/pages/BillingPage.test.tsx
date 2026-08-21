import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBilling, getBillingPlans } from '@/api/billing';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { BillingPage } from '@/pages/BillingPage';
import { buildBillingPlans, buildBillingSummary } from '@/test/factories';
import { theme } from '@/theme/theme';
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
  });

  it('renders subscription and credit pack catalog from the API', async () => {
    renderBillingPage();

    expect(await screen.findByRole('heading', { name: 'Starter' })).toBeInTheDocument();
    expect(screen.getByText('£39 / month')).toBeInTheDocument();
    expect(screen.getByText('20 credits / month')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '5 Credits' })).toBeInTheDocument();
    expect(screen.getByText('£14 one-time')).toBeInTheDocument();
  });
});
