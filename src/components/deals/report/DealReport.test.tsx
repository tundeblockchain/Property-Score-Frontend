import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DealReport } from '@/components/deals/report/DealReport';
import {
  buildDealDetail,
  buildEpcEnrichment,
  buildFinancialModel,
  buildListing,
  buildScoreBreakdown,
} from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

const deal = buildDealDetail({
  listing: buildListing({ description: 'A four bed terrace near the station.' }),
  scores: buildScoreBreakdown(),
  financialModel: buildFinancialModel(),
  enrichment: { epc: buildEpcEnrichment() },
});

describe('DealReport', () => {
  it('renders one section heading per section, below the page heading', () => {
    renderWithProviders(<DealReport deal={deal} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Score breakdown' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Listing description' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'EPC' }),
    ).toBeInTheDocument();
  });

  it('starts with the decision-critical sections open and the rest closed', () => {
    renderWithProviders(<DealReport deal={deal} />);

    expect(
      screen.getByRole('button', { name: /Financial model/i }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'EPC' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('keeps a closed section out of the DOM until it is opened', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DealReport deal={deal} />);

    expect(screen.getByText('Asking price')).toBeInTheDocument();
    expect(screen.queryByText('Current rating')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'EPC' }));

    expect(await screen.findByText('Current rating')).toBeInTheDocument();
  });

  it('opens a section when the reader clicks its header', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DealReport deal={deal} />);

    const epc = screen.getByRole('button', { name: 'EPC' });
    await user.click(epc);

    expect(epc).toHaveAttribute('aria-expanded', 'true');
  });

  it('expands everything at once, then collapses everything', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DealReport deal={deal} />);

    await user.click(screen.getByRole('button', { name: /Expand all/ }));

    expect(screen.getByRole('button', { name: 'EPC' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.click(screen.getByRole('button', { name: /Collapse all/ }));

    expect(screen.getByRole('button', { name: 'EPC' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(
      screen.getByRole('button', { name: /Financial model/i }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a collapsed section chosen from the nav', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DealReport deal={deal} />);

    await user.click(screen.getByRole('link', { name: 'EPC' }));

    expect(screen.getByRole('button', { name: 'EPC' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('gives each section an anchor target matching its nav link', () => {
    renderWithProviders(<DealReport deal={deal} />);

    const link = screen.getByRole('link', { name: 'Score breakdown' });
    const target = document.getElementById('score-breakdown');

    expect(link).toHaveAttribute('href', '#score-breakdown');
    expect(target).not.toBeNull();
  });

  it('renders nothing while analysis is still running and has no content yet', () => {
    renderWithProviders(
      <DealReport deal={buildDealDetail({ status: 'PROCESSING' })} />,
    );

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Expand all/ }),
    ).not.toBeInTheDocument();
  });

  it('shows a muted placeholder when an always-run check returned nothing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DealReport deal={buildDealDetail()} />);

    await user.click(screen.getByRole('button', { name: 'Transport' }));

    expect(
      await screen.findByText('Not available for this property.'),
    ).toBeInTheDocument();
  });

  it('opens every section before print so unmounted content is included', () => {
    renderWithProviders(<DealReport deal={deal} />);

    expect(screen.getByRole('button', { name: 'EPC' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    act(() => {
      window.dispatchEvent(new Event('beforeprint'));
    });

    expect(screen.getByRole('button', { name: 'EPC' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Current rating')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });

    expect(screen.getByRole('button', { name: 'EPC' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
