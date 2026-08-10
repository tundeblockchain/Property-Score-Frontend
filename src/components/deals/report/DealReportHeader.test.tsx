import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DealReportHeader } from '@/components/deals/report/DealReportHeader';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('DealReportHeader', () => {
  it('makes the address the page heading', () => {
    renderWithProviders(
      <DealReportHeader address="12 Example Road, Leeds" status="COMPLETED" />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: '12 Example Road, Leeds' }),
    ).toBeInTheDocument();
  });

  it('offers a way back to the property list', () => {
    renderWithProviders(
      <DealReportHeader address="12 Example Road" status="COMPLETED" />,
    );

    expect(screen.getByRole('link', { name: 'All properties' })).toHaveAttribute(
      'href',
      '/deals',
    );
  });

  it('shows the status and the last update together', () => {
    renderWithProviders(
      <DealReportHeader
        address="12 Example Road"
        status="PROCESSING"
        updatedAt="2026-03-12T14:30:00.000Z"
      />,
    );

    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText(/^Updated .*2026/)).toBeInTheDocument();
  });

  it('falls back to a placeholder when there is no update time', () => {
    renderWithProviders(
      <DealReportHeader address="12 Example Road" status="FAILED" />,
    );

    expect(screen.getByText('Updated —')).toBeInTheDocument();
  });

  it('renders the supplied action', () => {
    renderWithProviders(
      <DealReportHeader
        address="12 Example Road"
        status="COMPLETED"
        action={<button type="button">Download PDF</button>}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Download PDF' }),
    ).toBeInTheDocument();
  });
});
