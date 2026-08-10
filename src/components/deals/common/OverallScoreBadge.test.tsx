import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OverallScoreBadge } from '@/components/deals/common/OverallScoreBadge';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('OverallScoreBadge', () => {
  it('announces the score, the scale and the band as one graphic', () => {
    renderWithProviders(<OverallScoreBadge score={82} />);

    expect(
      screen.getByRole('img', { name: 'Overall score 82 out of 100, Strong' }),
    ).toBeInTheDocument();
  });

  it('names the band for a weak score', () => {
    renderWithProviders(<OverallScoreBadge score={31} />);

    expect(
      screen.getByRole('img', { name: 'Overall score 31 out of 100, Weak' }),
    ).toBeInTheDocument();
  });

  it('shows the band word when asked, so meaning is not colour-only', () => {
    renderWithProviders(<OverallScoreBadge score={70} showBand />);

    expect(screen.getByText('Fair')).toBeInTheDocument();
  });

  it('hides the band word by default', () => {
    renderWithProviders(<OverallScoreBadge score={70} />);

    expect(screen.queryByText('Fair')).not.toBeInTheDocument();
  });

  it('shows the score out of 100 at the default size', () => {
    renderWithProviders(<OverallScoreBadge score={64} />);

    expect(screen.getByText('64')).toBeInTheDocument();
    expect(screen.getByText('/100')).toBeInTheDocument();
  });

  it('drops the /100 suffix at the small size used in the deal list', () => {
    renderWithProviders(<OverallScoreBadge score={64} size="sm" />);

    expect(screen.getByText('64')).toBeInTheDocument();
    expect(screen.queryByText('/100')).not.toBeInTheDocument();
  });

  it('clamps an out-of-range score to the displayed scale', () => {
    renderWithProviders(<OverallScoreBadge score={130} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Overall score 100 out of 100, Strong' }),
    ).toBeInTheDocument();
  });
});
