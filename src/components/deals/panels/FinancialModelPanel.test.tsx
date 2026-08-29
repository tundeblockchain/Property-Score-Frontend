import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinancialModelPanel } from '@/components/deals/panels/FinancialModelPanel';
import { buildFinancialModel } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('FinancialModelPanel', () => {
  it('pairs each metric with its figure as a definition list', () => {
    renderWithProviders(
      <FinancialModelPanel model={buildFinancialModel()} />,
    );

    expect(screen.getAllByRole('term')).toHaveLength(5);
    expect(screen.getAllByRole('definition')).toHaveLength(5);
    expect(screen.getByText('Asking price')).toBeInTheDocument();
    expect(screen.getByText('£250,000')).toBeInTheDocument();
    expect(screen.getByText('Gross yield')).toBeInTheDocument();
    expect(screen.getByText('8.6%')).toBeInTheDocument();
  });

  it('carries the sign in the text, so a loss is not signalled by colour alone', () => {
    renderWithProviders(
      <FinancialModelPanel
        model={buildFinancialModel({ netCashFlowAnnual: -2400 })}
      />,
    );

    expect(screen.getByText('-£2,400')).toBeInTheDocument();
  });

  it('renders a placeholder rather than a figure when a metric is missing', () => {
    renderWithProviders(
      <FinancialModelPanel
        model={buildFinancialModel({ estimatedRoi: undefined })}
      />,
    );

    expect(screen.getByText('Est. ROI')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('adds occupancy when the analysis is a family AST', () => {
    renderWithProviders(
      <FinancialModelPanel
        model={buildFinancialModel()}
        occupancyBasis="3-bed AST"
      />,
    );

    expect(screen.getAllByRole('term')).toHaveLength(6);
    expect(screen.getByText('Occupancy')).toBeInTheDocument();
    expect(screen.getByText('3-bed AST')).toBeInTheDocument();
  });
});
