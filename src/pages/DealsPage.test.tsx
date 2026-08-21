import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBilling } from '@/api/billing';
import { listDeals } from '@/api/deals';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { DealsPage } from '@/pages/DealsPage';
import { buildBillingSummary, buildDealSummary } from '@/test/factories';
import { theme } from '@/theme/theme';
import type { User } from '@/models';

vi.mock('@/api/billing', () => ({
  getBilling: vi.fn(),
  getBillingPlans: vi.fn(),
  createCheckout: vi.fn(),
  createPortal: vi.fn(),
}));

vi.mock('@/api/deals', () => ({
  listDeals: vi.fn(),
}));

const authValue: AuthContextValue = {
  user: { email: 'investor@example.com' } as User,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
  getIdToken: vi.fn().mockResolvedValue('token'),
};

function renderDealsPage(): void {
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
          <MemoryRouter initialEntries={['/deals']}>
            <AuthContext.Provider value={authValue}>
              {children}
            </AuthContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  render(<DealsPage />, { wrapper: Wrapper });
}

describe('DealsPage', () => {
  beforeEach(() => {
    vi.mocked(getBilling).mockResolvedValue(buildBillingSummary());
    vi.mocked(listDeals).mockResolvedValue({ deals: [] });
  });

  it('shows the analyse form when the user has no properties', async () => {
    renderDealsPage();

    expect(
      await screen.findByRole('heading', { name: 'Analyse a listing' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Paste a Rightmove listing to create your first report.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /rightmove url/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Start analysis' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('No properties yet')).not.toBeInTheDocument();
  });

  it('shows the property list instead of the form when deals exist', async () => {
    vi.mocked(listDeals).mockResolvedValue({
      deals: [
        buildDealSummary({
          listing: {
            url: 'https://www.rightmove.co.uk/properties/123456',
            source: 'rightmove',
            address: '12 Example Road, Leeds',
          },
        }),
      ],
    });

    renderDealsPage();

    expect(
      await screen.findByRole('link', { name: /12 Example Road, Leeds/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your 25 most recent analyses, newest first.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Analyse a listing' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: /rightmove url/i }),
    ).not.toBeInTheDocument();
  });
});
