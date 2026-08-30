import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorAlert, FailedAnalysisAlert } from '@/components/common/Feedback';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('ErrorAlert', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the user-facing message and logs the error once', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('network down');

    const { rerender } = renderWithProviders(<ErrorAlert error={error} />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong. Please try again.',
    );
    expect(errorSpy).toHaveBeenCalledWith(error);

    errorSpy.mockClear();
    rerender(<ErrorAlert error={error} />);

    expect(errorSpy).not.toHaveBeenCalled();
  });
});

describe('FailedAnalysisAlert', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a generic failure message and logs the server detail', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(
      <FailedAnalysisAlert errorMessage="model timed out" />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      /could not be completed/i,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Analysis failed',
      'model timed out',
    );
  });
});
