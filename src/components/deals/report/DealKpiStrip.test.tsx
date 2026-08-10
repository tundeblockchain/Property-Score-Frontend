import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DealKpiStrip } from '@/components/deals/report/DealKpiStrip';
import {
  buildFinancialModel,
  buildHmoPlanner,
  buildHmoScheme,
} from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('DealKpiStrip', () => {
  it('surfaces the headline financial figures', () => {
    renderWithProviders(
      <DealKpiStrip financialModel={buildFinancialModel()} />,
    );

    expect(screen.getByText('Gross yield')).toBeInTheDocument();
    expect(screen.getByText('8.6%')).toBeInTheDocument();
    expect(screen.getByText('£1,800')).toBeInTheDocument();
    expect(screen.getByText('£7,200')).toBeInTheDocument();
    expect(screen.getByText('12.4%')).toBeInTheDocument();
  });

  it('links each figure to the section that explains it', () => {
    renderWithProviders(
      <DealKpiStrip financialModel={buildFinancialModel()} />,
    );

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(4);
    for (const link of links) {
      expect(link).toHaveAttribute('href', '#financial-model');
    }
  });

  it('keeps every tile present with a placeholder when there is no model', () => {
    renderWithProviders(<DealKpiStrip />);

    expect(screen.getByRole('list', { name: 'Key figures' })).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(4);
  });

  it('adds the room count of the recommended HMO scheme', () => {
    renderWithProviders(
      <DealKpiStrip
        financialModel={buildFinancialModel()}
        hmoPlanner={buildHmoPlanner({
          schemes: [
            buildHmoScheme({ id: 'workers', lettingRooms: 6, recommended: false }),
            buildHmoScheme({ id: 'students', lettingRooms: 4, recommended: true }),
          ],
          recommendedSchemeId: 'students',
        })}
      />,
    );

    expect(screen.getByText('HMO rooms')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /HMO rooms/ })).toHaveAttribute(
      'href',
      '#hmo-overview',
    );
  });

  it('falls back to the flagged scheme when the recommended id is unknown', () => {
    renderWithProviders(
      <DealKpiStrip
        hmoPlanner={buildHmoPlanner({
          schemes: [
            buildHmoScheme({ id: 'workers', lettingRooms: 6, recommended: false }),
            buildHmoScheme({ id: 'students', lettingRooms: 7, recommended: true }),
          ],
          recommendedSchemeId: 'missing',
        })}
      />,
    );

    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('omits the HMO tile for properties without a planner result', () => {
    renderWithProviders(
      <DealKpiStrip financialModel={buildFinancialModel()} />,
    );

    expect(screen.queryByText('HMO rooms')).not.toBeInTheDocument();
  });
});
