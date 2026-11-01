import { isSupportedLivingScheme } from '@/components/deals/hmoPlanner/labels';
import type {
  HmoLayoutScheme,
  HmoPlannerResult,
  HmoSchemeRendering,
  HmoStaffRoomChoice,
  HmoUseCase,
} from '@/models';

const USE_CASE_ORDER: readonly HmoUseCase[] = [
  'students',
  'workers',
  'social_care',
];

function schemeForUseCase(
  schemes: readonly HmoLayoutScheme[],
  useCase: HmoUseCase,
): HmoLayoutScheme | undefined {
  const byUseCase = schemes.find((scheme) => scheme.useCase === useCase);
  if (byUseCase) {
    return byUseCase;
  }
  if (useCase === 'social_care') {
    return schemes.find((scheme) => isSupportedLivingScheme(scheme));
  }
  return undefined;
}

/**
 * Schemes in a stable product order rather than whatever the API returned.
 * `social_care` stays in that order even when the backend keys it only by id.
 * Any other scheme the API sends is appended so it is not silently dropped.
 */
export function orderedHmoSchemes(
  planner: HmoPlannerResult,
): HmoLayoutScheme[] {
  const remaining = new Map(
    planner.schemes.map((scheme) => [scheme.id, scheme]),
  );
  const ordered: HmoLayoutScheme[] = [];

  for (const useCase of USE_CASE_ORDER) {
    const match = schemeForUseCase(planner.schemes, useCase);
    if (match && remaining.has(match.id)) {
      ordered.push(match);
      remaining.delete(match.id);
    }
  }

  for (const scheme of planner.schemes) {
    if (remaining.has(scheme.id)) {
      ordered.push(scheme);
      remaining.delete(scheme.id);
    }
  }

  return ordered;
}

export function staffRoomChoice(
  scheme: Pick<HmoLayoutScheme, 'supportedLiving' | 'conversionPlan'>,
): HmoStaffRoomChoice | undefined {
  if (scheme.supportedLiving?.staffRoom) {
    return scheme.supportedLiving.staffRoom;
  }
  const step = scheme.conversionPlan?.steps.find(
    (item) => item.action === 'staff_room',
  );
  if (!step) {
    return undefined;
  }
  return {
    option: step.sourceLabel,
    reason: step.rationale,
  };
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
