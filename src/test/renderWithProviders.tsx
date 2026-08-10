import { ThemeProvider } from '@mui/material/styles';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '@/theme/theme';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

/** Renders with the real theme and a router, matching how the app mounts. */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', ...options }: Options = {},
): RenderResult {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
