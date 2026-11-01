import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SchemeAccordion } from '@/components/deals/hmoPlanner/SchemeAccordion';
import {
  buildConversionPlan,
  buildHmoScheme,
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

  it('renders the backend supported-living payload, including a negative override BoQ line', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SchemeAccordion scheme={backendSupportedLivingScheme} />,
    );

    expect(
      screen.queryByText('Provider / regulatory risk: Medium-High'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Chosen: With ensuite')).toBeInTheDocument();
    expect(screen.getByText('Resident-room layout')).toBeInTheDocument();
    expect(
      screen.getByText('Chosen: Standard (shared bathrooms)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Rent across the lease')).toBeInTheDocument();
    expect(screen.queryByText('LD1')).not.toBeInTheDocument();

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

    await user.click(screen.getByRole('button', { name: 'Fire / escape' }));

    expect(await screen.findByText('Alarm grade')).toBeInTheDocument();
    expect(screen.getByText('LD1')).toBeInTheDocument();
  });
});
