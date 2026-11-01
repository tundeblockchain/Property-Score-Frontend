import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchemeOverviewSection } from '@/components/deals/hmoPlanner/SchemeOverviewSection';
import {
  buildHmoScheme,
  buildSupportedLiving,
  buildSupportedLivingScheme,
} from '@/test/factories';
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

  it('renders supported living from the extras fixture', () => {
    const extras = backendSupportedLivingScheme.supportedLiving;
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

    const resident = screen.getByRole('region', { name: 'Resident-room layout' });
    expect(
      within(resident).getByText('Chosen: Standard (shared bathrooms)'),
    ).toBeInTheDocument();
    expect(within(resident).getByText('Ensuites')).toBeInTheDocument();
    expect(within(resident).getByText('Chosen')).toBeInTheDocument();
    if (extras?.residentRoomOptionReason) {
      expect(
        within(resident).getByText(extras.residentRoomOptionReason),
      ).toBeInTheDocument();
    }

    const staff = screen.getByRole('region', { name: 'Staff-room choice' });
    expect(within(staff).getByText('Chosen: With ensuite')).toBeInTheDocument();
    expect(within(staff).getByText('Without ensuite')).toBeInTheDocument();
    expect(within(staff).getByText('Chosen')).toBeInTheDocument();

    expect(
      screen.getByText(
        "Each layout's figures assume the chosen option for the other.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Bedroom 1')).toBeInTheDocument();
    expect(screen.getByText('Staff room')).toBeInTheDocument();
  });

  it('marks the ensuite resident layout as chosen', () => {
    renderWithProviders(
      <SchemeOverviewSection
        scheme={buildSupportedLivingScheme({
          supportedLiving: buildSupportedLiving({
            residentRoomOption: 'ensuite',
            residentRoomOptionReason:
              'Chose resident rooms as ensuite: net cash flow £9,000 vs £7,000; ROI on deposit 5.0% vs 3.0%. Higher net cash flow wins.',
            residentRoomOptions: {
              standard: {
                option: 'standard',
                netCashFlowAnnual: 7000,
                estimatedRoi: 3,
              },
              ensuite: {
                option: 'ensuite',
                netCashFlowAnnual: 9000,
                estimatedRoi: 5,
              },
            },
          }),
        })}
      />,
    );

    const resident = screen.getByRole('region', { name: 'Resident-room layout' });
    expect(within(resident).getByText('Chosen: Ensuites')).toBeInTheDocument();
    expect(within(resident).getByText('Chosen')).toBeInTheDocument();
    expect(
      within(resident).queryByText('Chosen: Standard (shared bathrooms)'),
    ).not.toBeInTheDocument();

    const staff = screen.getByRole('region', { name: 'Staff-room choice' });
    expect(within(staff).getByText('Chosen: With ensuite')).toBeInTheDocument();
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
