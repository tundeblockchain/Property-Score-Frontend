import { describe, expect, it } from 'vitest';
import { buildSupportedLivingLeaseRent } from '@/test/factories';
import {
  backendSupportedLivingScheme,
  ensuiteWinningSupportedLivingScheme,
  parseBackendSupportedLivingScheme,
  rawStandardWinningScheme,
  supportedLivingPlannerSnapshot,
} from '@/test/fixtures/supportedLivingScheme';

describe('backend supported-living fixture', () => {
  it('loads the captured buildHmoPlanner snapshot', () => {
    expect(supportedLivingPlannerSnapshot.generatedBy).toBe('buildHmoPlanner');
    expect(
      supportedLivingPlannerSnapshot.standardWinning.residentRoomOption,
    ).toBe('standard');
    expect(
      supportedLivingPlannerSnapshot.ensuiteWinning.residentRoomOption,
    ).toBe('ensuite');
  });

  it('parses planner extras as SupportedLivingSchemeExtras', () => {
    const extras = backendSupportedLivingScheme.supportedLiving;

    expect(backendSupportedLivingScheme.useCase).toBe('social_care');
    expect(extras).toBeDefined();
    expect(extras).not.toHaveProperty('outputs');
    expect(extras?.inputs.rentPerRoomWeekly).toEqual({
      value: 180,
      isEstimate: true,
    });
    expect(extras?.inputs.residentEnsuiteRentPremiumWeekly).toEqual({
      value: 0,
      isEstimate: true,
    });
    expect(extras?.inputs.leaseTermYears.value).toBe(5);
    expect(extras?.inputs.breakYear.value).toBe(3);
    expect(extras?.inputs.cpiUpliftPct.value).toBe(2);
    expect(extras?.leaseRentByYear[0]).toEqual({
      year: 1,
      weeklyRentPerRoomGbp: 180,
      annualRentGbp: 28080,
    });
    expect(extras?.leaseRentByYear[1]).toEqual({
      year: 2,
      weeklyRentPerRoomGbp: 184,
      annualRentGbp: 28642,
    });
    expect(extras?.leaseRentByYear[0]).not.toHaveProperty('rentGbp');
    expect(extras?.planningNote).toBe(
      'Sleep-in staff may need C2 planning permission.',
    );
    expect(backendSupportedLivingScheme.licensing.useClass).not.toBe('C2');
    expect(extras?.staffRoomOption).toBe('without_ensuite');
    expect(extras?.staffRoomOptions.withoutEnsuite).toEqual({
      option: 'without_ensuite',
      netCashFlowAnnual: 4252,
      estimatedRoi: 4.86,
    });
    expect(extras?.residentRoomOption).toBe('standard');
    expect(extras?.residentRoomOptions.standard).toEqual({
      option: 'standard',
      netCashFlowAnnual: 4252,
      estimatedRoi: 4.86,
    });
    expect(extras?.residentRoomOptions.ensuite).toEqual({
      option: 'ensuite',
      netCashFlowAnnual: 4252,
      estimatedRoi: 4.5,
    });
    expect(extras?.residentRoomOptionReason).toBe(
      'Chose resident rooms as standard shared bathrooms: net cash flow £4,252 vs £4,252; ROI on deposit 4.86% vs 4.5%. Net cash flow is equal, so the higher ROI on deposit wins.',
    );
    expect(extras?.riskBadge).toBe('Provider / regulatory risk: Medium-High');
    expect(backendSupportedLivingScheme.rooms.every((room) => room.id)).toBe(
      true,
    );
    expect(backendSupportedLivingScheme.fireEscape?.alarmGrade).toBe('LD1');
  });

  it('parses the ensuite-winning planner scheme', () => {
    const extras = ensuiteWinningSupportedLivingScheme.supportedLiving;

    expect(extras?.residentRoomOption).toBe('ensuite');
    expect(extras?.staffRoomOption).toBe('without_ensuite');
    expect(extras?.residentRoomOptions.ensuite).toEqual({
      option: 'ensuite',
      netCashFlowAnnual: 6787,
      estimatedRoi: 7.18,
    });
    expect(extras?.residentRoomOptionReason).toBe(
      'Chose resident rooms with ensuite wet rooms: net cash flow £6,787 vs £4,252; ROI on deposit 7.18% vs 4.86%. Higher net cash flow wins.',
    );
    expect(extras?.inputs.residentEnsuiteRentPremiumWeekly).toEqual({
      value: 25,
      isEstimate: false,
    });
    expect(extras?.leaseRentByYear[1]).toEqual({
      year: 2,
      weeklyRentPerRoomGbp: 209,
      annualRentGbp: 32620,
    });
  });

  it('builds annual lease rent from the unrounded weekly figure', () => {
    expect(buildSupportedLivingLeaseRent(280, 4, 2, 2)[1]).toEqual({
      year: 2,
      weeklyRentPerRoomGbp: 286,
      annualRentGbp: 59405,
    });
  });

  it('rejects an invented outputs object', () => {
    expect(() =>
      parseBackendSupportedLivingScheme({
        ...rawStandardWinningScheme,
        supportedLiving: {
          ...rawStandardWinningScheme.supportedLiving,
          outputs: { rentAcrossLeaseGbp: 1 },
        },
      }),
    ).toThrow(/must not have an outputs object/);
  });

  it('rejects extras that omit the resident-room layout', () => {
    const { residentRoomOption: _omit, ...rest } =
      rawStandardWinningScheme.supportedLiving;
    expect(() =>
      parseBackendSupportedLivingScheme({
        ...rawStandardWinningScheme,
        supportedLiving: rest,
      }),
    ).toThrow(/missing residentRoomOption/);
  });

  it('rejects lease rows that still use rentGbp', () => {
    expect(() =>
      parseBackendSupportedLivingScheme({
        ...rawStandardWinningScheme,
        supportedLiving: {
          ...rawStandardWinningScheme.supportedLiving,
          leaseRentByYear: [{ year: 1, rentGbp: 58240 }],
        },
      }),
    ).toThrow(/weeklyRentPerRoomGbp and annualRentGbp/);
  });
});
