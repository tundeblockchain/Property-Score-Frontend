import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchemeOverviewSection } from '@/components/deals/hmoPlanner/SchemeOverviewSection';
import { buildHmoScheme, buildSupportedLivingScheme } from '@/test/factories';
import { backendSupportedLivingScheme } from '@/test/fixtures/supportedLivingScheme';
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
    expect(screen.queryByText('Assumptions')).not.toBeInTheDocument();
  });

  it('renders supported living from the backend planner fixture', () => {
    renderWithProviders(
      <SchemeOverviewSection scheme={backendSupportedLivingScheme} />,
    );

    expect(
      screen.getByText('Sleep-in staff may need C2 planning permission.'),
    ).toBeInTheDocument();

    expect(screen.getByText('Rent per room / wk')).toBeInTheDocument();
    expect(screen.getAllByText('£280').length).toBeGreaterThan(0);
    expect(screen.getByText('Lease term')).toBeInTheDocument();
    expect(screen.getByText('5 years')).toBeInTheDocument();
    expect(screen.getByText('Year 3')).toBeInTheDocument();
    expect(screen.getByText('Staff ensuite rent premium / wk')).toBeInTheDocument();
    expect(screen.getAllByText('Estimate').length).toBeGreaterThan(0);

    expect(screen.getByText('Yield on vacant possession')).toBeInTheDocument();
    expect(screen.getByText('Premium over a normal let')).toBeInTheDocument();
    expect(
      screen.getByText('Provider-failure net cash flow'),
    ).toBeInTheDocument();
    expect(screen.getByText('Rent across the lease')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Rent / room / wk' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Annual rent' }),
    ).toBeInTheDocument();

    expect(screen.getByText('Resident-room layout')).toBeInTheDocument();
    expect(
      screen.getByText('Chosen: Standard (shared bathrooms)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Ensuites')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Standard rooms with shared bathrooms are the default supported-living layout/,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Staff-room choice')).toBeInTheDocument();
    expect(screen.getByText('Chosen: With ensuite')).toBeInTheDocument();
    expect(screen.getByText('Without ensuite')).toBeInTheDocument();
    expect(screen.getAllByText('Chosen').length).toBeGreaterThan(1);

    expect(screen.getByText('Bedroom 1')).toBeInTheDocument();
    expect(screen.getByText('Staff room')).toBeInTheDocument();
  });

  it('hides supported-living extras when the payload has none', () => {
    renderWithProviders(
      <SchemeOverviewSection
        scheme={buildSupportedLivingScheme({ supportedLiving: undefined })}
      />,
    );

    expect(screen.queryByText('Assumptions')).not.toBeInTheDocument();
    expect(screen.queryByText('Resident-room layout')).not.toBeInTheDocument();
    expect(screen.queryByText('Staff-room choice')).not.toBeInTheDocument();
  });
});
