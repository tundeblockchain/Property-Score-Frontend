import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AccountMessageForm } from '@/components/account/AccountMessageForm';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('AccountMessageForm', () => {
  it('validates the subject and body before submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(
      <AccountMessageForm
        title="Report a bug"
        description="Tell us what went wrong."
        bodyLabel="What happened?"
        submitLabel="Send bug report"
        pendingLabel="Sending…"
        successMessage="Thanks."
        pending={false}
        error={null}
        succeeded={false}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByRole('textbox', { name: /subject/i }), 'Hi');
    await user.type(
      screen.getByRole('textbox', { name: /what happened/i }),
      'Too short',
    );
    await user.click(screen.getByRole('button', { name: 'Send bug report' }));

    expect(
      screen.getByText('Subject must be between 3 and 120 characters.'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid message and shows success', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <AccountMessageForm
        title="Contact us"
        description="Ask a question."
        bodyLabel="Your question"
        submitLabel="Send message"
        pendingLabel="Sending…"
        successMessage="Thanks. We have sent your message to the team."
        pending={false}
        error={null}
        succeeded
        onSubmit={onSubmit}
      />,
    );

    await user.type(
      screen.getByRole('textbox', { name: /subject/i }),
      'Billing question',
    );
    await user.type(
      screen.getByRole('textbox', { name: /your question/i }),
      'Can I move from Starter to Pro mid-cycle?',
    );
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(onSubmit).toHaveBeenCalledWith({
      subject: 'Billing question',
      body: 'Can I move from Starter to Pro mid-cycle?',
    });
    expect(
      screen.getByText('Thanks. We have sent your message to the team.'),
    ).toBeInTheDocument();
  });
});
