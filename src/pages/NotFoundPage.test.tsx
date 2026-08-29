import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { theme } from '@/theme/theme';

describe('NotFoundPage', () => {
  it('offers a way back to indexable pages', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'href',
      '/pricing',
    );
  });
});
