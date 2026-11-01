import { describe, expect, it } from 'vitest';
import {
  orderedHmoSchemes,
  proposedFloorPlanRendering,
  schemeForProposedLayout,
  schemesWithReadyProposedLayout,
  staffRoomChoice,
} from '@/components/deals/hmoPlanner/schemes';
import type { HmoUseCase } from '@/models';
import {
  buildConversionPlan,
  buildHmoPlanner,
  buildHmoScheme,
  buildHmoSchemeRendering,
  buildSupportedLiving,
} from '@/test/factories';

describe('schemeForProposedLayout', () => {
  it('prefers the recommended scheme when it has a conversion plan', () => {
    const recommended = buildHmoScheme({
      id: 'students',
      useCase: 'students',
      recommended: true,
      conversionPlan: buildConversionPlan(),
    });
    const other = buildHmoScheme({
      id: 'workers',
      useCase: 'workers',
      recommended: false,
      conversionPlan: buildConversionPlan({ useCase: 'workers' }),
    });

    expect(
      schemeForProposedLayout(buildHmoPlanner({ schemes: [other, recommended] }))
        ?.id,
    ).toBe('students');
  });

  it('falls back to the first scheme with a conversion plan', () => {
    const workers = buildHmoScheme({
      id: 'workers',
      useCase: 'workers',
      recommended: false,
      conversionPlan: buildConversionPlan({ useCase: 'workers' }),
    });

    expect(
      schemeForProposedLayout(
        buildHmoPlanner({
          recommendedSchemeId: 'students',
          schemes: [
            buildHmoScheme({
              id: 'students',
              useCase: 'students',
              recommended: true,
            }),
            workers,
          ],
        }),
      )?.id,
    ).toBe('workers');
  });
});

describe('schemesWithReadyProposedLayout', () => {
  it('returns ready schemes in product order', () => {
    const planner = buildHmoPlanner({
      schemes: [
        buildHmoScheme({
          id: 'workers',
          useCase: 'workers',
          recommended: false,
          renderings: [buildHmoSchemeRendering({ status: 'ready' })],
        }),
        buildHmoScheme({
          id: 'students',
          useCase: 'students',
          recommended: true,
          renderings: [buildHmoSchemeRendering({ status: 'pending' })],
        }),
      ],
    });

    expect(
      schemesWithReadyProposedLayout(planner).map((scheme) => scheme.id),
    ).toEqual(['workers']);
  });
});

describe('proposedFloorPlanRendering', () => {
  it('finds the proposed floor-plan rendering', () => {
    const rendering = buildHmoSchemeRendering({ status: 'ready' });
    expect(
      proposedFloorPlanRendering(buildHmoScheme({ renderings: [rendering] })),
    ).toEqual(rendering);
  });
});

describe('orderedHmoSchemes', () => {
  it('returns schemes in use-case order', () => {
    expect(
      orderedHmoSchemes(
        buildHmoPlanner({
          schemes: [
            buildHmoScheme({
              id: 'care',
              useCase: 'social_care',
              recommended: false,
            }),
            buildHmoScheme({
              id: 'students',
              useCase: 'students',
              recommended: true,
            }),
          ],
        }),
      ).map((scheme) => scheme.id),
    ).toEqual(['students', 'care']);
  });

  it('keeps a supported-living scheme keyed only by id', () => {
    expect(
      orderedHmoSchemes(
        buildHmoPlanner({
          schemes: [
            buildHmoScheme({
              id: 'social_care',
              // Backend scheme key stays `social_care` even if useCase is renamed.
              useCase: 'supported_living' as HmoUseCase,
              recommended: false,
            }),
            buildHmoScheme({
              id: 'students',
              useCase: 'students',
              recommended: true,
            }),
          ],
        }),
      ).map((scheme) => scheme.id),
    ).toEqual(['students', 'social_care']);
  });

  it('appends leftover schemes instead of dropping them', () => {
    expect(
      orderedHmoSchemes(
        buildHmoPlanner({
          schemes: [
            buildHmoScheme({
              id: 'students',
              useCase: 'students',
              recommended: true,
            }),
            buildHmoScheme({
              id: 'workers',
              useCase: 'workers',
              recommended: false,
            }),
            buildHmoScheme({
              id: 'workers-b',
              useCase: 'workers',
              recommended: false,
            }),
          ],
        }),
      ).map((scheme) => scheme.id),
    ).toEqual(['students', 'workers', 'workers-b']);
  });
});

describe('staffRoomChoice', () => {
  it('prefers the supported-living staff-room decision', () => {
    expect(
      staffRoomChoice(
        buildHmoScheme({
          supportedLiving: buildSupportedLiving(),
          conversionPlan: buildConversionPlan({
            steps: [
              {
                sourceLabel: 'Study',
                sourceKind: 'other',
                action: 'staff_room',
                targetType: 'staff',
                rationale: 'Fallback from the conversion plan.',
                estimatedCostGbpLow: 0,
                estimatedCostGbpHigh: 0,
              },
            ],
          }),
        }),
      ),
    ).toEqual({
      option: 'Keep the smallest rear bedroom as staff',
      reason:
        'Overnight cover needs a staff room; the 7.2 m² rear single is below the letting space standard and sits next to the bathroom.',
    });
  });

  it('falls back to the conversion-plan staff-room step', () => {
    expect(
      staffRoomChoice(
        buildHmoScheme({
          conversionPlan: buildConversionPlan({
            steps: [
              {
                sourceLabel: 'Study',
                sourceKind: 'other',
                action: 'staff_room',
                targetType: 'staff',
                rationale: 'Staff need a sleep-in next to the bathroom.',
                estimatedCostGbpLow: 800,
                estimatedCostGbpHigh: 1400,
              },
            ],
          }),
        }),
      ),
    ).toEqual({
      option: 'Study',
      reason: 'Staff need a sleep-in next to the bathroom.',
    });
  });
});
