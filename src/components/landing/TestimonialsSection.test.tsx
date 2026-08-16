import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listPublishedTestimonials } from '@/api/testimonials';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { buildPublicTestimonial } from '@/test/factories';
import { theme } from '@/theme/theme';

vi.mock('@/api/testimonials', () => ({
  listPublishedTestimonials: vi.fn(async () => ({ testimonials: [] })),
}));

function renderSection(): void {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>{children}</MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  render(<TestimonialsSection />, { wrapper: Wrapper });
}

describe('TestimonialsSection', () => {
  beforeEach(() => {
    vi.mocked(listPublishedTestimonials).mockResolvedValue({ testimonials: [] });
  });

  it('shows curated quotes when none have been published yet', async () => {
    vi.mocked(listPublishedTestimonials).mockResolvedValue({ testimonials: [] });
    renderSection();

    expect(
      await screen.findByRole('heading', {
        name: 'What people check before they commit',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I used to spend a Sunday on Rightmove/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Share your experience' }),
    ).toHaveAttribute('href', '/account');
  });

  it('shows published testimonials from the API when they exist', async () => {
    vi.mocked(listPublishedTestimonials).mockResolvedValue({
      testimonials: [
        buildPublicTestimonial({
          id: 'live_1',
          displayName: 'Amina',
          role: 'HMO investor, Bristol',
          quote: 'Licensing notes were the first thing I read.',
        }),
      ],
    });
    renderSection();

    expect(
      await screen.findByText('Licensing notes were the first thing I read.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Amina')).toBeInTheDocument();
    expect(
      screen.queryByText(/I used to spend a Sunday on Rightmove/i),
    ).not.toBeInTheDocument();
  });
});
