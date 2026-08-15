import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProposedLayoutGallery } from '@/components/deals/hmoPlanner/ProposedLayoutGallery';
import { getSchemeRender } from '@/api/deals';
import {
  buildHmoScheme,
  buildHmoSchemeRendering,
} from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';

vi.mock('@/api/deals', () => ({
  getSchemeRender: vi.fn(),
  postSchemeRender: vi.fn(),
}));

const getSchemeRenderMock = vi.mocked(getSchemeRender);

function renderGallery(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return renderWithProviders(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe('ProposedLayoutGallery', () => {
  beforeEach(() => {
    getSchemeRenderMock.mockReset();
  });

  it('shows a ready rendering in the lightbox', async () => {
    const user = userEvent.setup();
    getSchemeRenderMock.mockResolvedValue({
      dealId: 'deal-1',
      schemeId: 'scheme-students',
      rendering: buildHmoSchemeRendering({ status: 'ready' }),
      imageUrl: 'https://example.com/proposed-floor-plan.png',
      expiresInSeconds: 900,
    });

    renderGallery(
      <ProposedLayoutGallery
        dealId="deal-1"
        schemes={[
          buildHmoScheme({
            renderings: [buildHmoSchemeRendering({ status: 'ready' })],
          }),
        ]}
      />,
    );

    await user.click(
      await screen.findByRole('button', { name: 'View proposed layout 1 of 1' }),
    );

    expect(
      screen.getByRole('dialog', { name: 'Proposed layout preview' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Proposed layout 1 of 1' }),
    ).toHaveAttribute('src', 'https://example.com/proposed-floor-plan.png');
  });

  it('shows a thumbnail for each floor', async () => {
    getSchemeRenderMock.mockResolvedValue({
      dealId: 'deal-1',
      schemeId: 'scheme-students',
      rendering: buildHmoSchemeRendering({ status: 'ready' }),
      imageUrl: 'https://example.com/ground.png',
      imageUrls: [
        'https://example.com/ground.png',
        'https://example.com/first.png',
      ],
      expiresInSeconds: 900,
    });

    renderGallery(
      <ProposedLayoutGallery
        dealId="deal-1"
        schemes={[
          buildHmoScheme({
            renderings: [buildHmoSchemeRendering({ status: 'ready' })],
          }),
        ]}
      />,
    );

    expect(
      await screen.findByRole('button', { name: 'View proposed layout 1 of 2' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'View proposed layout 2 of 2' }),
    ).toBeInTheDocument();
  });
});
