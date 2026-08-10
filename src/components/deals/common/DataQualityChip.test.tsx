import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DataQualityChip } from '@/components/deals/common/DataQualityChip';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('DataQualityChip', () => {
  it('labels estimated figures', () => {
    renderWithProviders(<DataQualityChip quality="estimated" />);

    expect(screen.getByText('Estimated')).toBeInTheDocument();
  });

  it('labels thin data differently from estimated data', () => {
    renderWithProviders(<DataQualityChip quality="limited" />);

    expect(screen.getByText('Limited data')).toBeInTheDocument();
  });

  it('explains the caveat to keyboard users', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DataQualityChip quality="estimated" />);

    await user.tab();

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      /Modelled from area averages/,
    );
  });
});
