import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import {
  AuthContext,
  type AuthContextValue,
} from '@/auth/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { theme } from '@/theme/theme';
import type { User } from '@/models';

const signedIn: AuthContextValue = {
  user: { email: 'investor@example.com' } as User,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue('token'),
};

function renderLogin(state?: { from?: string }): void {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
          <AuthContext.Provider value={signedIn}>
            <Routes>
              <Route path="/login" element={children} />
              <Route path="/deals" element={<div>Properties</div>} />
              <Route path="/account" element={<div>Account</div>} />
            </Routes>
          </AuthContext.Provider>
        </MemoryRouter>
      </ThemeProvider>
    );
  }

  render(<LoginPage />, { wrapper: Wrapper });
}

describe('LoginPage', () => {
  it('sends an already signed-in user to Properties', () => {
    renderLogin();
    expect(screen.getByText('Properties')).toBeInTheDocument();
  });

  it('returns to the protected page they were trying to open', () => {
    renderLogin({ from: '/account' });
    expect(screen.getByText('Account')).toBeInTheDocument();
  });
});
