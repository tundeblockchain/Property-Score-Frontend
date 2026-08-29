import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { theme } from '@/theme/theme';
import type { User } from '@/models';

const signedOutAuth: AuthContextValue = {
  user: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  getIdToken: async () => null,
};

const signedInAuth: AuthContextValue = {
  ...signedOutAuth,
  user: { email: 'investor@example.com' } as User,
};

function renderFooter(auth: AuthContextValue): void {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
        </MemoryRouter>
      </ThemeProvider>
    );
  }

  render(<SiteFooter />, { wrapper: Wrapper });
}

describe('SiteFooter', () => {
  it('exposes public marketing links for visitors', () => {
    renderFooter(signedOutAuth);

    const nav = screen.getByRole('navigation', { name: 'Footer' });
    expect(nav).toHaveTextContent('Home');
    expect(nav).toHaveTextContent('Pricing');
    expect(nav).toHaveTextContent('FAQ');
    expect(nav).toHaveTextContent('Sign in');
  });

  it('points signed-in users at app pages instead of sign in', () => {
    renderFooter(signedInAuth);

    expect(
      screen.getByRole('navigation', { name: 'Footer' }),
    ).toHaveTextContent('Properties');
    expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
  });
});
