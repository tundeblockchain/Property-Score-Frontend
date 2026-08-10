import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScoreBreakdownBars } from '@/components/deals/common/ScoreBreakdownBars';
import { buildScoreBreakdown } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('ScoreBreakdownBars', () => {
  it('shows every pillar alongside the overall score by default', () => {
    renderWithProviders(<ScoreBreakdownBars scores={buildScoreBreakdown()} />);

    expect(screen.getByText('Overall')).toBeInTheDocument();
    expect(screen.getByText('Financial')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
    expect(screen.getByText('Market demand')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Refurb')).toBeInTheDocument();
  });

  it('drops the overall row where the score is already shown elsewhere', () => {
    renderWithProviders(
      <ScoreBreakdownBars
        scores={buildScoreBreakdown()}
        includeOverall={false}
      />,
    );

    expect(screen.queryByText('Overall')).not.toBeInTheDocument();
    expect(screen.getByText('Financial')).toBeInTheDocument();
  });

  it('shows only the overall score while compact', () => {
    renderWithProviders(
      <ScoreBreakdownBars scores={buildScoreBreakdown()} compact />,
    );

    expect(screen.getByText('Overall')).toBeInTheDocument();
    expect(screen.queryByText('Financial')).not.toBeInTheDocument();
  });
});
