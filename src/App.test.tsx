import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { App } from '@/App';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { theme } from '@/theme/theme';

const authValue: AuthContextValue = {
  user: null,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue(null),
};

function renderApp(route: string): void {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[route]}>
            <AuthContext.Provider value={authValue}>
              {children}
            </AuthContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  render(<App />, { wrapper: Wrapper });
}

describe('App route code splitting', () => {
  it('renders an eager public page immediately', async () => {
    renderApp('/login');

    expect(
      await screen.findByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('redirects unauthenticated users away from protected routes', async () => {
    renderApp('/analyse');

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /sign in/i }),
      ).toBeInTheDocument();
    });
  });

  it('redirects unauthenticated users away from the account page', async () => {
    renderApp('/account');

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /sign in/i }),
      ).toBeInTheDocument();
    });
  });

  it('lets unauthenticated users land on the Stripe success page', async () => {
    renderApp('/billing/success?session_id=cs_test');

    expect(
      await screen.findByRole(
        'heading',
        { name: /payment successful/i },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
  });

  it('shows a not-found page for unknown URLs instead of sending people home', async () => {
    renderApp('/this-page-does-not-exist');

    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
  });
});
