import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { renderWithProviders } from '@/test/renderWithProviders';

function ControlledDialog({
  confirmPhrase,
}: {
  confirmPhrase?: string;
}) {
  const [open, setOpen] = useState(true);
  const onConfirm = vi.fn();

  return (
    <ConfirmDialog
      open={open}
      title="Clear all properties?"
      description="This permanently deletes every analysed property."
      confirmLabel="Clear all properties"
      confirmPhrase={confirmPhrase}
      onClose={() => setOpen(false)}
      onConfirm={onConfirm}
    />
  );
}

describe('ConfirmDialog', () => {
  it('confirms a destructive action from the dialog', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    renderWithProviders(
      <ConfirmDialog
        open
        title="Clear all properties?"
        description="This permanently deletes every analysed property."
        confirmLabel="Clear all properties"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Clear all properties?' }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Clear all properties' }),
    );

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('keeps confirm disabled until the required phrase is typed', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    renderWithProviders(
      <ConfirmDialog
        open
        title="Delete your account?"
        description="This permanently removes your account."
        confirmLabel="Delete account"
        confirmPhrase="investor@example.com"
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    const confirmButton = screen.getByRole('button', { name: 'Delete account' });
    expect(confirmButton).toBeDisabled();

    await user.type(
      screen.getByLabelText('Type investor@example.com to confirm'),
      'investor@example.com',
    );

    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('closes without confirming', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ControlledDialog />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'Clear all properties?' }),
      ).not.toBeInTheDocument();
    });
  });
});
