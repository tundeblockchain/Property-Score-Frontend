import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchemeAccordion } from '@/components/deals/hmoPlanner/SchemeAccordion';
import { buildConversionPlan, buildHmoScheme } from '@/test/factories';
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
});
