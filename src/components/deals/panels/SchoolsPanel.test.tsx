import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchoolsPanel } from '@/components/deals/panels/SchoolsPanel';
import { buildSchoolsEnrichment } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('SchoolsPanel', () => {
  it('shows Ofsted Good/Outstanding and ratings on nearby schools', () => {
    renderWithProviders(
      <SchoolsPanel
        schools={buildSchoolsEnrichment({
          schoolCountWithin2Miles: 9,
          goodOrOutstandingWithin2Miles: 4,
          nearestPrimaryMiles: 0.4,
          nearestSchoolName: 'Example Primary',
        })}
      />,
    );

    expect(screen.getByText('Within 2 miles')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('Good or Outstanding')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Nearest primary')).toBeInTheDocument();
    expect(
      screen.getByText('Example Primary (0.4 mi, Primary, Good)'),
    ).toBeInTheDocument();
  });
});
