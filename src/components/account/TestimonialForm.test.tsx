import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TestimonialForm } from '@/components/account/TestimonialForm';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('TestimonialForm', () => {
  it('validates the display name and quote before submitting', async () => {
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();

    renderWithProviders(
      <TestimonialForm
        pending={false}
        error={null}
        succeeded={false}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByRole('textbox', { name: /display name/i }), 'J');
    await user.type(screen.getByRole('textbox', { name: /your quote/i }), 'Too short');
    await user.click(screen.getByRole('button', { name: 'Send testimonial' }));

    expect(
      screen.getByText('Display name must be between 2 and 80 characters.'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid testimonial', async () => {
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <TestimonialForm
        pending={false}
        error={null}
        succeeded
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByRole('textbox', { name: /display name/i }), 'James');
    await user.type(
      screen.getByRole('textbox', { name: /role or location/i }),
      'HMO investor',
    );
    await user.type(
      screen.getByRole('textbox', { name: /your quote/i }),
      'Clear licensing notes before I booked the surveyor.',
    );
    await user.click(screen.getByRole('button', { name: 'Send testimonial' }));

    expect(onSubmit).toHaveBeenCalledWith({
      displayName: 'James',
      role: 'HMO investor',
      quote: 'Clear licensing notes before I booked the surveyor.',
    });
    expect(
      screen.getByText(
        'Thanks. We have received your testimonial and will review it shortly.',
      ),
    ).toBeInTheDocument();
  });
});
