import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GenerateProposedLayoutButton } from '@/components/deals/hmoPlanner/GenerateProposedLayoutButton';
import { getSchemeRender, postSchemeRender } from '@/api/deals';
import {
  buildConversionPlan,
  buildDealDetail,
  buildHmoPlanner,
  buildHmoScheme,
  buildHmoSchemeRendering,
} from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { RenderDealSchemeResponse } from '@/models';

vi.mock('@/api/deals', () => ({
  getSchemeRender: vi.fn(),
  postSchemeRender: vi.fn(),
}));

vi.mock('@/hooks/useBilling', () => ({
  useBilling: () => ({
    data: { creditsRemaining: 5 },
    isLoading: false,
    isError: false,
  }),
}));

const getSchemeRenderMock = vi.mocked(getSchemeRender);
const postSchemeRenderMock = vi.mocked(postSchemeRender);

function renderButton(ui: ReactElement) {
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

const pendingResponse: RenderDealSchemeResponse = {
  dealId: 'deal-1',
  schemeId: 'scheme-students',
  rendering: buildHmoSchemeRendering({ status: 'pending' }),
};

function completedDeal() {
  return buildDealDetail({
    hmoPlanner: buildHmoPlanner({
      schemes: [
        buildHmoScheme({
          conversionPlan: buildConversionPlan(),
        }),
      ],
    }),
  });
}

describe('GenerateProposedLayoutButton', () => {
  beforeEach(() => {
    getSchemeRenderMock.mockReset();
    postSchemeRenderMock.mockReset();
  });

  it('starts a proposed layout from the report header', async () => {
    const user = userEvent.setup();
    postSchemeRenderMock.mockResolvedValue(pendingResponse);

    renderButton(<GenerateProposedLayoutButton deal={completedDeal()} />);

    await user.click(
      screen.getByRole('button', { name: 'Generate proposed layout' }),
    );

    expect(postSchemeRenderMock).toHaveBeenCalledWith('deal-1', 'scheme-students');
    expect(
      await screen.findByLabelText('Generating proposed layout'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Generating layout…' }),
    ).toBeDisabled();
  });

  it('opens ready photos next to the PDF action', async () => {
    const user = userEvent.setup();
    getSchemeRenderMock.mockResolvedValue({
      dealId: 'deal-1',
      schemeId: 'scheme-students',
      rendering: buildHmoSchemeRendering({ status: 'ready' }),
      imageUrl: 'https://example.com/proposed-floor-plan.png',
      expiresInSeconds: 900,
    });

    renderButton(
      <GenerateProposedLayoutButton
        deal={buildDealDetail({
          hmoPlanner: buildHmoPlanner({
            schemes: [
              buildHmoScheme({
                conversionPlan: buildConversionPlan(),
                renderings: [buildHmoSchemeRendering({ status: 'ready' })],
              }),
            ],
          }),
        })}
      />,
    );

    await user.click(
      await screen.findByRole('button', { name: 'View proposed layout photos' }),
    );

    expect(
      screen.getByRole('dialog', { name: 'Proposed layout preview' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Proposed layout 1 of 1' }),
    ).toHaveAttribute('src', 'https://example.com/proposed-floor-plan.png');
  });

  it('lets the user retry a failed render', async () => {
    const user = userEvent.setup();
    postSchemeRenderMock.mockResolvedValue(pendingResponse);

    renderButton(
      <GenerateProposedLayoutButton
        deal={buildDealDetail({
          hmoPlanner: buildHmoPlanner({
            schemes: [
              buildHmoScheme({
                conversionPlan: buildConversionPlan(),
                renderings: [
                  buildHmoSchemeRendering({
                    status: 'failed',
                    errorMessage: 'The proposed layout could not be generated.',
                  }),
                ],
              }),
            ],
          }),
        })}
      />,
    );

    expect(
      screen.getByText('The proposed layout could not be generated.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(postSchemeRenderMock).toHaveBeenCalledWith('deal-1', 'scheme-students');
  });

  it('explains a skipped render instead of offering generate', () => {
    renderButton(
      <GenerateProposedLayoutButton
        deal={buildDealDetail({
          hmoPlanner: buildHmoPlanner({
            schemes: [
              buildHmoScheme({
                conversionPlan: buildConversionPlan(),
                renderings: [
                  buildHmoSchemeRendering({
                    status: 'skipped',
                    skipReason: 'no_floor_plan_image',
                  }),
                ],
              }),
            ],
          }),
        })}
      />,
    );

    expect(
      screen.getByText(
        'A listing floor-plan image is needed to generate a proposed layout.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Generate proposed layout/i }),
    ).not.toBeInTheDocument();
  });

  it('does not show on an incomplete deal', () => {
    renderButton(
      <GenerateProposedLayoutButton
        deal={buildDealDetail({
          status: 'PROCESSING',
          hmoPlanner: buildHmoPlanner({
            schemes: [
              buildHmoScheme({ conversionPlan: buildConversionPlan() }),
            ],
          }),
        })}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /Generate proposed layout/i }),
    ).not.toBeInTheDocument();
  });
});
