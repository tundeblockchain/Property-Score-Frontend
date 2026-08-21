import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SchemeAccordion } from '@/components/deals/hmoPlanner/SchemeAccordion';
import {
  buildConversionPlan,
  buildHmoScheme,
  buildTierAccess,
} from '@/test/factories';
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
});
