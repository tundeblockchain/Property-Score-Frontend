import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Fact } from '@/components/deals/common/Fact';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('Fact', () => {
  it('pairs a label with its value', () => {
    renderWithProviders(<Fact label="Gross yield" value="8.6%" />);

    expect(screen.getByText('Gross yield')).toBeInTheDocument();
    expect(screen.getByText('8.6%')).toBeInTheDocument();
  });

  it('has no info control when no explanation is supplied', () => {
    renderWithProviders(<Fact label="Gross yield" value="8.6%" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('explains the metric on hover of a labelled info control', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Fact
        label="Gross yield"
        value="8.6%"
        info="Annual rent before costs, divided by asking price."
      />,
    );

    await user.hover(screen.getByRole('button', { name: 'About Gross yield' }));

    expect(
      await screen.findByRole('tooltip', {
        name: 'Annual rent before costs, divided by asking price.',
      }),
    ).toBeInTheDocument();
  });

  it('keeps an emphasised value out of the heading outline', () => {
    renderWithProviders(
      <Fact label="Current rating" value="C" emphasis="strong" />,
    );

    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies a supplied value colour, for values where colour carries meaning', () => {
    renderWithProviders(
      <Fact label="Current rating" value="C" valueColor="#65A30D" />,
    );

    expect(screen.getByText('C')).toHaveStyle({ color: '#65A30D' });
  });
});
