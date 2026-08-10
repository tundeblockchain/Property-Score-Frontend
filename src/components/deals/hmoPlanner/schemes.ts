import type { HmoLayoutScheme, HmoPlannerResult, HmoUseCase } from '@/models';

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
