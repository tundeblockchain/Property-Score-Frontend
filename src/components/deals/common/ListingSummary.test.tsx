import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListingSummary } from '@/components/deals/common/ListingSummary';
import { buildListing } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('ListingSummary', () => {
  it('links to Rightmove for Rightmove listings', () => {
    renderWithProviders(
      <ListingSummary
        listing={buildListing({
          url: 'https://www.rightmove.co.uk/properties/123456',
          source: 'rightmove',
        })}
      />,
    );

    expect(
      screen.getByRole('link', { name: 'View on Rightmove' }),
    ).toHaveAttribute('href', 'https://www.rightmove.co.uk/properties/123456');
  });

  it('links to OnTheMarket for OnTheMarket listings', () => {
    renderWithProviders(
      <ListingSummary
        listing={buildListing({
          url: 'https://www.onthemarket.com/details/19498710/',
          source: 'onthemarket',
        })}
      />,
    );

    expect(
      screen.getByRole('link', { name: 'View on OnTheMarket' }),
    ).toHaveAttribute('href', 'https://www.onthemarket.com/details/19498710/');
  });
});
