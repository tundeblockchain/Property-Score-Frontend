import type {
  HmoLayoutScheme,
  HmoPlannerResult,
  HmoSchemeRendering,
  HmoUseCase,
} from '@/models';

const USE_CASE_ORDER: readonly HmoUseCase[] = [
  'students',
  'workers',
  'social_care',
];

/** Schemes in a stable product order rather than whatever the API returned. */
export function orderedHmoSchemes(
  planner: HmoPlannerResult,
): HmoLayoutScheme[] {
  const byUseCase = new Map(
    planner.schemes.map((scheme) => [scheme.useCase, scheme]),
  );

  return USE_CASE_ORDER.map((useCase) => byUseCase.get(useCase)).filter(
    (scheme): scheme is HmoLayoutScheme => scheme != null,
  );
}

export function proposedFloorPlanRendering(
  scheme: Pick<HmoLayoutScheme, 'renderings'>,
): HmoSchemeRendering | undefined {
  return scheme.renderings?.find((item) => item.kind === 'proposed_floor_plan');
}

/** Recommended scheme with a conversion plan, otherwise the first that has one. */
export function schemeForProposedLayout(
  planner: HmoPlannerResult,
): HmoLayoutScheme | undefined {
  const schemes = orderedHmoSchemes(planner);
  return (
    schemes.find((scheme) => scheme.recommended && scheme.conversionPlan) ??
    schemes.find((scheme) => scheme.conversionPlan)
  );
}

export function schemesWithReadyProposedLayout(
  planner: HmoPlannerResult,
): HmoLayoutScheme[] {
  return orderedHmoSchemes(planner).filter(
    (scheme) => proposedFloorPlanRendering(scheme)?.status === 'ready',
  );
}
