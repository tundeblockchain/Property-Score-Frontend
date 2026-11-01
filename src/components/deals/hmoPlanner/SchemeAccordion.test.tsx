import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SchemeAccordion } from '@/components/deals/hmoPlanner/SchemeAccordion';
import {
  buildConversionPlan,
  buildHmoScheme,
  buildSupportedLivingScheme,
  buildTierAccess,
} from '@/test/factories';
import { backendSupportedLivingScheme } from '@/test/fixtures/supportedLivingScheme';
import { formatCurrency } from '@/lib/format';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('SchemeAccordion', () => {
  it('does not nest proposed layout inside the scheme', () => {
    renderWithProviders(
      <SchemeAccordion
        scheme={buildHmoScheme({ conversionPlan: buildConversionPlan() })}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Proposed layout' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Generate proposed layout' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Conversion plan' }),
    ).toBeInTheDocument();
  });

  it('locks conversion, BoQ and fire checks when the planner is gated', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SchemeAccordion
        scheme={buildHmoScheme()}
        tierAccess={buildTierAccess({ fullHmoPlanner: false })}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Conversion plan' }));

    expect(
      await screen.findByText(
        'Upgrade to Starter to unlock conversion steps, BoQ and fire checks.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View plans' })).toHaveAttribute(
      'href',
      '/pricing',
    );
  });

  it('renders the captured supported-living payload', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SchemeAccordion scheme={backendSupportedLivingScheme} />,
    );

    expect(
      screen.queryByText('Provider / regulatory risk: Medium-High'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Chosen: Without ensuite')).toBeInTheDocument();
    expect(screen.getByText('Resident-room layout')).toBeInTheDocument();
    expect(
      screen.getByText('Chosen: Standard (shared bathrooms)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Rent across the lease')).toBeInTheDocument();
    expect(screen.queryByText('LD1')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Refurb BoQ' }));

    expect(await screen.findByText('Accessible wet rooms')).toBeInTheDocument();
    expect(screen.getByText('Staff / sleep-in room fit-out')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Fire / escape' }));

    expect(await screen.findByText('Alarm grade')).toBeInTheDocument();
    expect(screen.getByText('LD1')).toBeInTheDocument();
  });

  it('shows a negative override BoQ line', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SchemeAccordion
        scheme={buildSupportedLivingScheme({
          refurbBoq: {
            lineItems: [
              {
                id: 'boq-override',
                category: 'override',
                label: 'Staff ensuite already present — omit wet room',
                quantity: 1,
                lowGbp: -6500,
                highGbp: -6500,
                notes: 'Negative override because the listing already has a staff wet room.',
                source: 'override',
              },
            ],
            subtotalLowGbp: 0,
            subtotalHighGbp: 2500,
            totalLowGbp: 0,
            totalHighGbp: 2750,
            contingencyPct: 0.1,
            notes: [],
            disclaimer: 'Indicative only.',
          },
        })}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Refurb BoQ' }));

    expect(
      await screen.findByText('Staff ensuite already present — omit wet room'),
    ).toBeInTheDocument();
    expect(screen.getByText('Override')).toBeInTheDocument();
    expect(
      screen.getByText(
        `${formatCurrency(-6500)} – ${formatCurrency(-6500)}`,
      ),
    ).toBeInTheDocument();
  });
});
