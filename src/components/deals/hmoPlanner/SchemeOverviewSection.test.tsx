import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchemeOverviewSection } from '@/components/deals/hmoPlanner/SchemeOverviewSection';
import {
  buildHmoScheme,
  buildSupportedLiving,
  buildSupportedLivingScheme,
} from '@/test/factories';
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

  it('shows supported-living inputs, extra outputs, staff-room choice and the C2 note', () => {
    renderWithProviders(
      <SchemeOverviewSection scheme={buildSupportedLivingScheme()} />,
    );

    expect(
      screen.getByText(
        /C2 planning: modelled as a residential institution/,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Rent per room / wk')).toBeInTheDocument();
    expect(screen.getByText('Lease term')).toBeInTheDocument();
    expect(screen.getByText('20 years')).toBeInTheDocument();
    expect(screen.getByText('Break year')).toBeInTheDocument();
    expect(screen.getByText('Year 10')).toBeInTheDocument();
    expect(screen.getByText('CPI uplift')).toBeInTheDocument();
    expect(screen.getByText('FRI')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Vacant-possession value')).toBeInTheDocument();
    expect(screen.getByText('Refurb low')).toBeInTheDocument();
    expect(screen.getByText('Refurb high')).toBeInTheDocument();
    expect(screen.getByText('Compliance lump sum')).toBeInTheDocument();

    expect(screen.getAllByText('Estimate').length).toBeGreaterThan(0);

    expect(screen.getByText('Rent across the lease')).toBeInTheDocument();
    expect(screen.getByText('Yield on vacant possession')).toBeInTheDocument();
    expect(screen.getByText('8.4%')).toBeInTheDocument();
    expect(screen.getByText('Premium over a normal let')).toBeInTheDocument();
    expect(
      screen.getByText('Provider-failure net cash flow'),
    ).toBeInTheDocument();

    expect(screen.getByText('Staff-room choice')).toBeInTheDocument();
    expect(
      screen.getByText('Keep the smallest rear bedroom as staff'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Overnight cover needs a staff room/),
    ).toBeInTheDocument();
  });

  it('still shows assumptions when the lease model is missing', () => {
    renderWithProviders(
      <SchemeOverviewSection
        scheme={buildSupportedLivingScheme({ supportedLiving: undefined })}
      />,
    );

    expect(screen.getByText('Assumptions')).toBeInTheDocument();
    expect(screen.getByText('Rent per room / wk')).toBeInTheDocument();
    expect(screen.getByText('Lease term')).toBeInTheDocument();
    expect(screen.queryByText('Rent across the lease')).not.toBeInTheDocument();
  });

  it('does not show supported-living extras on a student scheme that happens to include them', () => {
    renderWithProviders(
      <SchemeOverviewSection
        scheme={buildHmoScheme({
          supportedLiving: buildSupportedLiving(),
        })}
      />,
    );

    expect(screen.queryByText('Assumptions')).not.toBeInTheDocument();
    expect(screen.getByText('Staff-room choice')).toBeInTheDocument();
  });
});
