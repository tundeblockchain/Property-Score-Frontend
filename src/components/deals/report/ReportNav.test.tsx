import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReportNav } from '@/components/deals/report/ReportNav';
import { buildReportSections } from '@/components/deals/report/reportSections';
import {
  buildDealDetail,
  buildFinancialModel,
  buildScoreBreakdown,
} from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

const sections = buildReportSections(
  buildDealDetail({
    scores: buildScoreBreakdown(),
    financialModel: buildFinancialModel(),
  }),
);

describe('ReportNav', () => {
  it('lists every section as an anchor link', () => {
    renderWithProviders(
      <ReportNav sections={sections} activeId={null} onSelect={() => {}} />,
    );

    const nav = screen.getByRole('navigation', { name: 'Report sections' });

    expect(
      screen.getByRole('link', { name: 'Score breakdown' }),
    ).toHaveAttribute('href', '#score-breakdown');
    expect(
      screen.getByRole('link', { name: 'Financial model' }),
    ).toHaveAttribute('href', '#financial-model');
    expect(nav).toBeInTheDocument();
  });

  it('marks the section in view as current', () => {
    renderWithProviders(
      <ReportNav
        sections={sections}
        activeId="financial-model"
        onSelect={() => {}}
      />,
    );

    expect(
      screen.getByRole('link', { name: 'Financial model' }),
    ).toHaveAttribute('aria-current', 'true');
    expect(
      screen.getByRole('link', { name: 'Score breakdown' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('reports the chosen section so a collapsed target can be opened', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    renderWithProviders(
      <ReportNav
        sections={sections}
        activeId={null}
        onSelect={handleSelect}
      />,
    );

    await user.click(screen.getByRole('link', { name: 'Financial model' }));

    expect(handleSelect).toHaveBeenCalledWith('financial-model');
  });

  it('renders nothing when the report has no sections', () => {
    renderWithProviders(
      <ReportNav sections={[]} activeId={null} onSelect={() => {}} />,
    );

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
