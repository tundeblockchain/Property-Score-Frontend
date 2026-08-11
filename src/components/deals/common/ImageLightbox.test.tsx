import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ImageLightbox } from '@/components/deals/common/ImageLightbox';
import { renderWithProviders } from '@/test/renderWithProviders';

const images = [
  'https://example.com/a.jpg',
  'https://example.com/b.jpg',
  'https://example.com/c.jpg',
];

function ControlledLightbox({
  initialIndex = 0,
}: {
  initialIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(initialIndex);

  return (
    <ImageLightbox
      images={images}
      openIndex={openIndex}
      onClose={() => setOpenIndex(null)}
      onIndexChange={setOpenIndex}
      label="Property photo"
    />
  );
}

describe('ImageLightbox', () => {
  it('shows the position counter and close control when open', () => {
    renderWithProviders(<ControlledLightbox />);

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Close preview' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Property photo 1 of 3' }),
    ).toHaveAttribute('src', images[0]);
  });

  it('moves forward and wraps around with the next control', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ControlledLightbox />);

    await user.click(
      screen.getByRole('button', { name: 'Next property photo' }),
    );
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Next property photo' }),
    );
    expect(screen.getByText('3 / 3')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Next property photo' }),
    );
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('moves backward with the previous control', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ControlledLightbox initialIndex={0} />);

    await user.click(
      screen.getByRole('button', { name: 'Previous property photo' }),
    );

    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Property photo 3 of 3' }),
    ).toHaveAttribute('src', images[2]);
  });

  it('navigates with the arrow keys', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ControlledLightbox />);

    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('closes from the close control', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const handleIndexChange = vi.fn();

    renderWithProviders(
      <ImageLightbox
        images={images}
        openIndex={1}
        onClose={handleClose}
        onIndexChange={handleIndexChange}
        label="Property photo"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Close preview' }));

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('hides navigation when there is only one image', () => {
    renderWithProviders(
      <ImageLightbox
        images={[images[0]]}
        openIndex={0}
        onClose={() => {}}
        onIndexChange={() => {}}
        label="Property photo"
      />,
    );

    expect(screen.getByText('1 / 1')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Next property photo' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Previous property photo' }),
    ).not.toBeInTheDocument();
  });

  it('renders nothing interactive while closed', () => {
    renderWithProviders(
      <ImageLightbox
        images={images}
        openIndex={null}
        onClose={() => {}}
        onIndexChange={() => {}}
        label="Property photo"
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not keep a stale key listener after closing', () => {
    const handleIndexChange = vi.fn();
    const { rerender } = renderWithProviders(
      <ImageLightbox
        images={images}
        openIndex={0}
        onClose={() => {}}
        onIndexChange={handleIndexChange}
        label="Property photo"
      />,
    );

    rerender(
      <ImageLightbox
        images={images}
        openIndex={null}
        onClose={() => {}}
        onIndexChange={handleIndexChange}
        label="Property photo"
      />,
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight' }),
      );
    });

    expect(handleIndexChange).not.toHaveBeenCalled();
  });
});
