import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DealDetailSkeleton } from '@/components/deals/report/DealDetailSkeleton';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('DealDetailSkeleton', () => {
  it('announces itself as a loading status region', () => {
    renderWithProviders(<DealDetailSkeleton />);

    expect(
      screen.getByRole('status', { name: 'Loading property' }),
    ).toBeInTheDocument();
  });
});
