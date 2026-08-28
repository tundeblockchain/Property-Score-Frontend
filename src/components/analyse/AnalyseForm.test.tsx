import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { startAnalysis } from '@/api/analyse';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { AnalyseForm } from '@/components/analyse/AnalyseForm';
import { theme } from '@/theme/theme';
import type { User } from '@/models';

vi.mock('@/api/analyse', () => ({
  startAnalysis: vi.fn(),
  getAnalysisStatus: vi.fn(),
}));

const listingUrl = 'https://www.rightmove.co.uk/properties/173188025';

const authValue: AuthContextValue = {
  user: { email: 'investor@example.com' } as User,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
  getIdToken: vi.fn().mockResolvedValue('token'),
};

function renderForm(): void {
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

  render(
    <AnalyseForm creditsRemaining={4} onAccepted={vi.fn()} />,
    { wrapper: Wrapper },
  );
}

describe('AnalyseForm', () => {
  beforeEach(() => {
    vi.mocked(startAnalysis).mockResolvedValue({
      jobId: 'deal_1',
      status: 'PROCESSING',
    });
  });

  it('lets the user choose buy to let or HMO conversion', () => {
    renderForm();

    expect(
      screen.getByRole('group', { name: 'Analysis type' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'HMO conversion' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'Buy to let' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('starts an HMO analysis by default', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole('textbox', { name: /listing url/i }),
      listingUrl,
    );
    await user.click(screen.getByRole('button', { name: 'Start analysis' }));

    expect(startAnalysis).toHaveBeenCalledWith({
      listing_url: listingUrl,
      strategy: 'hmo',
    });
  });

  it('starts a buy-to-let analysis when that type is selected', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Buy to let' }));
    await user.type(
      screen.getByRole('textbox', { name: /listing url/i }),
      listingUrl,
    );
    await user.click(screen.getByRole('button', { name: 'Start analysis' }));

    expect(startAnalysis).toHaveBeenCalledWith({
      listing_url: listingUrl,
      strategy: 'buy_to_let',
    });
  });
});
