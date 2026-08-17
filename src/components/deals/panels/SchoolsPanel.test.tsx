import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchoolsPanel } from '@/components/deals/panels/SchoolsPanel';
import { buildSchoolsEnrichment } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('SchoolsPanel', () => {
  it('shows nearby schools in a table with named Ofsted grades', () => {
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
    expect(screen.getByText('4 of 9')).toBeInTheDocument();
    expect(screen.getByText('Nearest primary')).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', { name: 'School' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Ofsted' }),
    ).toBeInTheDocument();

    const row = screen.getByRole('row', { name: /Example Primary/ });
    expect(within(row).getByRole('cell', { name: 'Example Primary' })).toBeInTheDocument();
    expect(within(row).getByRole('cell', { name: '0.4 mi' })).toBeInTheDocument();
    expect(within(row).getByRole('cell', { name: 'Primary' })).toBeInTheDocument();
    expect(within(row).getByText('Good')).toBeInTheDocument();
  });

  it('maps numeric Ofsted codes and missing grades to meaningful labels', () => {
    renderWithProviders(
      <SchoolsPanel
        schools={buildSchoolsEnrichment({
          nearbySchools: [
            {
              name: 'Oaklands School',
              miles: 0.26,
              phase: 'Primary',
              ofstedRating: '1',
            },
            {
              name: 'Greenacre School',
              miles: 0.33,
              phase: 'Secondary',
              ofstedRating: '4',
            },
            { name: 'Uninspected Academy', miles: 0.5, phase: 'Secondary' },
          ],
        })}
      />,
    );

    expect(
      screen.getByLabelText(/Outstanding — Ofsted grade 1 of 4/),
    ).toHaveTextContent('Outstanding');
    expect(
      screen.getByLabelText(/Inadequate — Ofsted grade 4 of 4/),
    ).toHaveTextContent('Inadequate');
    expect(
      screen.getByLabelText(/No published Ofsted overall effectiveness grade/),
    ).toHaveTextContent('No grade');
  });
});
