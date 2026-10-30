import {
  FAMILY_LET_HEADLINE_LABEL,
  hmoUseCaseLabel,
} from '@/components/deals/hmoPlanner/labels';
import type {
  HmoFamilyLetHeadlineReturns,
  HmoHeadlineReturns,
  HmoLayoutScheme,
  HmoMoneySnapshot,
  HmoPlannerResult,
  HmoSchemeHeadlineReturns,
} from '@/models';

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
    label: hmoUseCaseLabel(scheme.useCase),
    lettingRooms: scheme.lettingRooms,
    ...money,
  };
  if (isFiniteNumber(scheme.estimatedRefurbLowGbp)) {
    headline.refurbEstimateLowGbp = scheme.estimatedRefurbLowGbp;
  }
  if (isFiniteNumber(scheme.estimatedRefurbHighGbp)) {
    headline.refurbEstimateHighGbp = scheme.estimatedRefurbHighGbp;
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
    label: FAMILY_LET_HEADLINE_LABEL,
    ...money,
  };
}

/**
 * Legacy fallback for saved deals that predate `hmoPlanner.headline`.
 * Mirrors packages/shared/src/hmo-money/headline.ts (highest netCashFlowAnnual,
 * then highest estimatedRoi; skip missing/non-finite figures, never coerce to 0).
 * Do not call this on fresh API results — use planner.headline via
 * resolveHmoHeadline.
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
