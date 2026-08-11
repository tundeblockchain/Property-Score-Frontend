import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PropertyImages } from '@/components/deals/panels/PropertyImages';
import { renderWithProviders } from '@/test/renderWithProviders';

const imageUrls = [
  'https://example.com/a.jpg',
  'https://example.com/b.jpg',
];

describe('PropertyImages', () => {
  it('opens the lightbox on the chosen thumbnail', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PropertyImages imageUrls={imageUrls} />);

    await user.click(
      screen.getByRole('button', { name: 'View property image 2 of 2' }),
    );

    expect(screen.getByRole('dialog', { name: 'Property photo preview' })).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Property photo 2 of 2' }),
    ).toHaveAttribute('src', imageUrls[1]);
  });

  it('renders nothing when there are no images', () => {
    const { container } = renderWithProviders(<PropertyImages imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
