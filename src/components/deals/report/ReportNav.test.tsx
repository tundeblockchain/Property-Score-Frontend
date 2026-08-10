import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

/** Lets a test say which section is in view, which jsdom cannot work out. */
class FakeIntersectionObserver implements IntersectionObserver {
  static latest: FakeIntersectionObserver | null = null;
  readonly root = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds: readonly number[] = [];
  private readonly targets: Element[] = [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.latest = this;
  }

  observe(target: Element): void {
    this.targets.push(target);
  }

  unobserve(): void {}
  disconnect(): void {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  bringIntoView(id: string): void {
    const entries = this.targets.map((target) => ({
      target,
      isIntersecting: target.id === id,
    })) as unknown as IntersectionObserverEntry[];

    this.callback(entries, this);
  }
}

/** The nav observes the section anchors, so they have to exist in the DOM. */
function renderNav(onSelect: (id: string) => void = () => {}) {
  return renderWithProviders(
    <>
      <div id="score-breakdown" />
      <div id="financial-model" />
      <ReportNav sections={sections} onSelect={onSelect} />
    </>,
  );
}

describe('ReportNav', () => {
  beforeEach(() => {
    FakeIntersectionObserver.latest = null;
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists every section as an anchor link', () => {
    renderNav();

    expect(
      screen.getByRole('navigation', { name: 'Report sections' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Score breakdown' }),
    ).toHaveAttribute('href', '#score-breakdown');
    expect(
      screen.getByRole('link', { name: 'Financial model' }),
    ).toHaveAttribute('href', '#financial-model');
  });

  it('marks the section scrolled into view as current', () => {
    renderNav();

    act(() => {
      FakeIntersectionObserver.latest?.bringIntoView('financial-model');
    });

    expect(
      screen.getByRole('link', { name: 'Financial model' }),
    ).toHaveAttribute('aria-current', 'true');
    expect(
      screen.getByRole('link', { name: 'Score breakdown' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('marks nothing as current before the reader has scrolled', () => {
    renderNav();

    expect(
      screen.getByRole('link', { name: 'Score breakdown' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('reports the chosen section so a collapsed target can be opened', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    renderNav(handleSelect);

    await user.click(screen.getByRole('link', { name: 'Financial model' }));

    expect(handleSelect).toHaveBeenCalledWith('financial-model');
  });

  it('renders nothing when the report has no sections', () => {
    renderWithProviders(<ReportNav sections={[]} onSelect={() => {}} />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
