import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionUnavailable } from '@/components/deals/report/SectionUnavailable';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('SectionUnavailable', () => {
  it('states that the check produced no data for this property', () => {
    renderWithProviders(<SectionUnavailable />);

    expect(
      screen.getByText('Not available for this property.'),
    ).toBeInTheDocument();
  });
});
