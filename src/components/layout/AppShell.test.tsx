import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBilling } from '@/api/billing';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { AppHeader } from '@/components/layout/AppShell';
import { buildBillingSummary } from '@/test/factories';
import { theme } from '@/theme/theme';
import type { User } from '@/models';

vi.mock('@/api/billing', () => ({
  getBilling: vi.fn(),
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

function renderHeader(route = '/analyse'): void {
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
              <Routes>
                <Route path="/" element={<div>Landing</div>} />
                <Route path="/analyse" element={<div>Analyse page</div>} />
              </Routes>
            </AuthContext.Provider>
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  render(<AppHeader />, { wrapper: Wrapper });
}

describe('AppHeader', () => {
  beforeEach(() => {
    vi.mocked(getBilling).mockResolvedValue(buildBillingSummary());
    signOut.mockClear();
  });

  it('takes a signed-in user to the landing page after sign out', async () => {
    const user = userEvent.setup({ delay: null });
    renderHeader('/analyse');

    expect(screen.getByText('Analyse page')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(signOut).toHaveBeenCalledOnce();
    expect(await screen.findByText('Landing')).toBeInTheDocument();
    expect(screen.queryByText('Analyse page')).not.toBeInTheDocument();
  });
});
