import { describe, expect, it } from 'vitest';
import { deriveHmoHeadline, resolveHmoHeadline } from '@/lib/hmoHeadline';
import {
  buildFamilyLetHeadline,
  buildFinancialModel,
  buildHmoMoneyComparison,
  buildHmoMoneySnapshot,
  buildHmoPlanner,
  buildHmoScheme,
  buildSchemeWithMoney,
} from '@/test/factories';

describe('deriveHmoHeadline', () => {
  it('picks the scheme with the highest net cash flow', () => {
    const planner = buildHmoPlanner({
      schemes: [
        buildSchemeWithMoney('students', 'students', {
          netCashFlowAnnual: 4_000,
          estimatedRoi: 20,
        }),
        buildSchemeWithMoney(
          'workers',
          'workers',
          { netCashFlowAnnual: 9_800, estimatedRoi: 14 },
          { lettingRooms: 6 },
        ),
        buildSchemeWithMoney('care', 'social_care', {
          netCashFlowAnnual: 6_000,
          estimatedRoi: 11,
        }),
      ],
      moneyComparison: buildHmoMoneyComparison({
        asListedFamily: buildHmoMoneySnapshot({
          netCashFlowAnnual: 3_100,
          estimatedRoi: 7,
        }),
      }),
    });

    expect(deriveHmoHeadline(planner)).toEqual(
      expect.objectContaining({
        basis: 'scheme',
        schemeId: 'workers',
        label: 'Workers HMO',
        lettingRooms: 6,
        netCashFlowAnnual: 9_800,
        estimatedRoi: 14,
        refurbEstimateLowGbp: 30_000,
        refurbEstimateHighGbp: 45_000,
      }),
    );
  });

  it('breaks a cash-flow tie with the higher estimated ROI', () => {
    const planner = buildHmoPlanner({
      schemes: [
        buildSchemeWithMoney('students', 'students', {
          netCashFlowAnnual: 8_000,
          estimatedRoi: 12,
        }),
        buildSchemeWithMoney('workers', 'workers', {
          netCashFlowAnnual: 8_000,
          estimatedRoi: 16.5,
        }),
      ],
    });

    expect(deriveHmoHeadline(planner)).toEqual(
      expect.objectContaining({
        basis: 'scheme',
        schemeId: 'workers',
        estimatedRoi: 16.5,
      }),
    );
  });

  it('can pick the as-listed family let over every HMO scheme', () => {
    const planner = buildHmoPlanner({
      schemes: [
        buildSchemeWithMoney('workers', 'workers', {
          netCashFlowAnnual: 1_200,
          estimatedRoi: 4,
        }),
      ],
      moneyComparison: buildHmoMoneyComparison({
        asListedFamily: buildHmoMoneySnapshot({
          estimatedRentMonthly: 850,
          grossYield: 6.4,
          netCashFlowAnnual: 3_100,
          estimatedRoi: 7.2,
        }),
      }),
    });

    expect(deriveHmoHeadline(planner)).toEqual({
      basis: 'family_let',
      label: 'Family let (as listed)',
      estimatedRentMonthly: 850,
      grossYield: 6.4,
      netCashFlowAnnual: 3_100,
      estimatedRoi: 7.2,
    });
  });

  it('skips candidates with missing or non-finite figures instead of coercing them to 0', () => {
    const planner = buildHmoPlanner({
      schemes: [
        buildHmoScheme({
          id: 'students',
          useCase: 'students',
          recommended: false,
          financials: {
            estimatedRentMonthly: 2_000,
            grossYield: 12,
            estimatedRoi: 99,
            voidRateAssumed: 0.08,
            roomRentWeeklyAssumed: 110,
            occupiedRoomsAssumed: 5,
          },
        }),
        buildHmoScheme({
          id: 'care',
          useCase: 'social_care',
          recommended: false,
          financials: {
            ...buildFinancialModel({
              netCashFlowAnnual: 50_000,
              estimatedRoi: Number.POSITIVE_INFINITY,
            }),
            voidRateAssumed: 0.08,
            roomRentWeeklyAssumed: 110,
            occupiedRoomsAssumed: 5,
          },
        }),
        buildSchemeWithMoney(
          'workers',
          'workers',
          { netCashFlowAnnual: 0, estimatedRoi: 1.5 },
          { lettingRooms: 6 },
        ),
      ],
      moneyComparison: buildHmoMoneyComparison({
        asListedFamily: buildHmoMoneySnapshot({
          estimatedRentMonthly: 850,
          grossYield: Number.NaN,
          netCashFlowAnnual: 9_999,
          estimatedRoi: 20,
        }),
      }),
    });

    expect(deriveHmoHeadline(planner)).toEqual(
      expect.objectContaining({
        basis: 'scheme',
        schemeId: 'workers',
        lettingRooms: 6,
        netCashFlowAnnual: 0,
        estimatedRoi: 1.5,
      }),
    );
  });

  it('breaks a cash-flow tie in favour of the family let when its ROI is higher', () => {
    const planner = buildHmoPlanner({
      schemes: [
        buildSchemeWithMoney('workers', 'workers', {
          netCashFlowAnnual: 3_100,
          estimatedRoi: 6,
        }),
      ],
      moneyComparison: buildHmoMoneyComparison({
        asListedFamily: buildHmoMoneySnapshot({
          netCashFlowAnnual: 3_100,
          estimatedRoi: 9,
        }),
      }),
    });

    expect(deriveHmoHeadline(planner)?.basis).toBe('family_let');
  });
});

describe('resolveHmoHeadline', () => {
  it('returns undefined when there is no planner', () => {
    expect(resolveHmoHeadline(undefined)).toBeUndefined();
  });

  it('uses the saved headline instead of re-deriving', () => {
    const headline = buildFamilyLetHeadline({
      estimatedRentMonthly: 900,
      grossYield: 6,
      netCashFlowAnnual: 2_000,
      estimatedRoi: 5,
    });
    const planner = buildHmoPlanner({
      headline,
      schemes: [
        buildSchemeWithMoney('workers', 'workers', {
          netCashFlowAnnual: 12_000,
          estimatedRoi: 20,
        }),
      ],
    });

    expect(resolveHmoHeadline(planner)).toEqual(headline);
  });
});
