import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import { Chip } from '@mui/material';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReportSection } from '@/components/deals/report/ReportSection';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('ReportSection', () => {
  it('exposes the title as a level 2 heading by default', () => {
    renderWithProviders(
      <ReportSection title="EPC">
        <p>Body</p>
      </ReportSection>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'EPC' })).toBeInTheDocument();
  });

  it('drops to a lower heading level for nested sections', () => {
    renderWithProviders(
      <ReportSection title="Licensing" headingLevel="h3">
        <p>Body</p>
      </ReportSection>,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Licensing' }),
    ).toBeInTheDocument();
  });

  it('keeps a decorative icon out of the accessible name', () => {
    renderWithProviders(
      <ReportSection title="EPC" icon={<BoltOutlinedIcon />}>
        <p>Body</p>
      </ReportSection>,
    );

    expect(screen.getByRole('button', { name: 'EPC' })).toBeInTheDocument();
  });

  it('shows a badge beside the title', () => {
    renderWithProviders(
      <ReportSection
        title="Young professionals"
        badge={<Chip label="Recommended" size="small" />}
      >
        <p>Body</p>
      </ReportSection>,
    );

    expect(screen.getByText('Recommended')).toBeInTheDocument();
  });

  it('reports its expanded state and toggles when uncontrolled', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ReportSection title="EPC">
        <p>Body</p>
      </ReportSection>,
    );

    const header = screen.getByRole('button', { name: 'EPC' });

    expect(header).toHaveAttribute('aria-expanded', 'false');

    await user.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'true');
  });

  it('defers to the caller while controlled', async () => {
    const user = userEvent.setup();
    const changes: boolean[] = [];
    renderWithProviders(
      <ReportSection
        title="EPC"
        expanded={false}
        onExpandedChange={(expanded) => changes.push(expanded)}
      >
        <p>Body</p>
      </ReportSection>,
    );

    const header = screen.getByRole('button', { name: 'EPC' });
    await user.click(header);

    expect(changes).toEqual([true]);
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });
});
