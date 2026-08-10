import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DealHeroCard } from '@/components/deals/report/DealHeroCard';
import {
  buildFinancialModel,
  buildListing,
  buildScoreBreakdown,
} from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('DealHeroCard', () => {
  it('shows the score ring and the key figures for a scored deal', () => {
    renderWithProviders(
      <DealHeroCard
        listing={buildListing()}
        scores={buildScoreBreakdown({ overall: 82 })}
        financialModel={buildFinancialModel()}
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Overall score 82 out of 100, Strong' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Key figures' })).toBeInTheDocument();
  });

  it('leaves the address to the page heading to avoid repeating it', () => {
    renderWithProviders(
      <DealHeroCard listing={buildListing({ address: '12 Example Road' })} />,
    );

    expect(screen.queryByText('12 Example Road')).not.toBeInTheDocument();
    expect(screen.getByText('£250,000')).toBeInTheDocument();
    expect(screen.getByText('Terraced')).toBeInTheDocument();
  });

  it('omits the score ring when the deal has no scores yet', () => {
    renderWithProviders(<DealHeroCard listing={buildListing()} />);

    expect(
      screen.queryByRole('img', { name: /Overall score/ }),
    ).not.toBeInTheDocument();
  });

  it('falls back to the source url when the listing was not parsed', () => {
    renderWithProviders(
      <DealHeroCard listingUrl="https://www.rightmove.co.uk/properties/999" />,
    );

    expect(
      screen.getByText('https://www.rightmove.co.uk/properties/999'),
    ).toBeInTheDocument();
  });
});
