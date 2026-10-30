import type {
  HmoFamilyLetHeadlineReturns,
  HmoHeadlineReturns,
  HmoLayoutScheme,
  HmoMoneySnapshot,
  HmoPlannerResult,
  HmoSchemeHeadlineReturns,
  HmoUseCase,
} from '@/models';

const FAMILY_LET_LABEL = 'Family let (as listed)';

const SCHEME_HEADLINE_LABEL: Record<HmoUseCase, string> = {
  students: 'Students HMO',
  workers: 'Workers HMO',
  social_care: 'Social care HMO',
};

interface HeadlineMoney {
  estimatedRentMonthly: number;
  grossYield: number;
  netCashFlowAnnual: number;
  estimatedRoi: number;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function completeMoney(model: {
  estimatedRentMonthly?: number;
  grossYield?: number;
  netCashFlowAnnual?: number;
  estimatedRoi?: number;
}): HeadlineMoney | undefined {
  const { estimatedRentMonthly, grossYield, netCashFlowAnnual, estimatedRoi } =
    model;
  if (
    !isFiniteNumber(estimatedRentMonthly) ||
    !isFiniteNumber(grossYield) ||
    !isFiniteNumber(netCashFlowAnnual) ||
    !isFiniteNumber(estimatedRoi)
  ) {
    return undefined;
  }
  return { estimatedRentMonthly, grossYield, netCashFlowAnnual, estimatedRoi };
}

function isBetter(candidate: HmoHeadlineReturns, best: HmoHeadlineReturns): boolean {
  if (candidate.netCashFlowAnnual !== best.netCashFlowAnnual) {
    return candidate.netCashFlowAnnual > best.netCashFlowAnnual;
  }
  return candidate.estimatedRoi > best.estimatedRoi;
}

function headlineFromScheme(
  scheme: HmoLayoutScheme,
): HmoSchemeHeadlineReturns | undefined {
  if (!scheme.id || !isFiniteNumber(scheme.lettingRooms)) {
    return undefined;
  }
  const money = completeMoney(scheme.financials);
  if (!money) {
    return undefined;
  }
  const headline: HmoSchemeHeadlineReturns = {
    basis: 'scheme',
    schemeId: scheme.id,
    label: SCHEME_HEADLINE_LABEL[scheme.useCase],
    lettingRooms: scheme.lettingRooms,
    ...money,
  };
  if (isFiniteNumber(scheme.estimatedRefurbLowGbp)) {
    headline.estimatedRefurbLowGbp = scheme.estimatedRefurbLowGbp;
  }
  if (isFiniteNumber(scheme.estimatedRefurbHighGbp)) {
    headline.estimatedRefurbHighGbp = scheme.estimatedRefurbHighGbp;
  }
  return headline;
}

function headlineFromFamilyLet(
  snapshot: HmoMoneySnapshot,
): HmoFamilyLetHeadlineReturns | undefined {
  const money = completeMoney(snapshot);
  if (!money) {
    return undefined;
  }
  return {
    basis: 'family_let',
    label: FAMILY_LET_LABEL,
    ...money,
  };
}

/**
 * Pick the best-return strategy from saved scheme financials and the as-listed
 * family let. Highest net cash flow wins; equal cash flow prefers higher ROI.
 * Candidates with missing or non-finite figures are skipped, not coerced to 0.
 */
export function deriveHmoHeadline(
  planner: HmoPlannerResult,
): HmoHeadlineReturns | undefined {
  const candidates: HmoHeadlineReturns[] = [];

  for (const scheme of planner.schemes) {
    const headline = headlineFromScheme(scheme);
    if (headline) {
      candidates.push(headline);
    }
  }

  if (planner.moneyComparison) {
    const family = headlineFromFamilyLet(planner.moneyComparison.asListedFamily);
    if (family) {
      candidates.push(family);
    }
  }

  if (candidates.length === 0) {
    return undefined;
  }

  return candidates.reduce((best, candidate) =>
    isBetter(candidate, best) ? candidate : best,
  );
}

/** Prefer the API headline; for older saved deals, derive it client-side. */
export function resolveHmoHeadline(
  planner: HmoPlannerResult | undefined,
): HmoHeadlineReturns | undefined {
  if (!planner) {
    return undefined;
  }
  return planner.headline ?? deriveHmoHeadline(planner);
}
