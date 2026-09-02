import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchemeOverviewSection } from '@/components/deals/hmoPlanner/SchemeOverviewSection';
import { buildHmoScheme } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('SchemeOverviewSection', () => {
  it('shows scheme room and money facts without area fit', () => {
    renderWithProviders(
      <SchemeOverviewSection scheme={buildHmoScheme({ fitScore: 78 })} />,
    );

    expect(screen.getByText('Letting rooms')).toBeInTheDocument();
    expect(screen.getByText('Est. monthly rent')).toBeInTheDocument();
    expect(screen.getByText('Gross yield')).toBeInTheDocument();
    expect(screen.queryByText('Area fit')).not.toBeInTheDocument();
    expect(screen.queryByText('78/100')).not.toBeInTheDocument();
  });
});
