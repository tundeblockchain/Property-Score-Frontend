import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FailedAnalysisAlert } from '@/components/common/Feedback';
import { renderWithProviders } from '@/test/renderWithProviders';

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
