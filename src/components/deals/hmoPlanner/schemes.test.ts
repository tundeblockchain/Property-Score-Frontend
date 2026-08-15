import { describe, expect, it } from 'vitest';
import {
  orderedHmoSchemes,
  proposedFloorPlanRendering,
  schemeForProposedLayout,
  schemesWithReadyProposedLayout,
} from '@/components/deals/hmoPlanner/schemes';
import {
  buildConversionPlan,
  buildHmoPlanner,
  buildHmoScheme,
  buildHmoSchemeRendering,
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
});
