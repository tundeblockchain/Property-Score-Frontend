import { describe, expect, it } from 'vitest';
import payload from '@/test/fixtures/supported-living-scheme.json';
import {
  backendSupportedLivingScheme,
  parseBackendSupportedLivingScheme,
} from '@/test/fixtures/supportedLivingScheme';

describe('backend supported-living fixture', () => {
  it('parses planner extras as SupportedLivingSchemeExtras', () => {
    const extras = backendSupportedLivingScheme.supportedLiving;

    expect(backendSupportedLivingScheme.useCase).toBe('social_care');
    expect(extras).toBeDefined();
    expect(extras).not.toHaveProperty('outputs');
    expect(extras?.inputs.rentPerRoomWeekly).toEqual({
      value: 280,
      isEstimate: true,
    });
    expect(extras?.inputs.leaseTermYears.value).toBe(5);
    expect(extras?.inputs.breakYear.value).toBe(3);
    expect(extras?.inputs.cpiUpliftPct.value).toBe(2);
    expect(extras?.leaseRentByYear[0]).toEqual({
      year: 1,
      weeklyRentPerRoomGbp: 280,
      annualRentGbp: 58240,
    });
    expect(extras?.leaseRentByYear[0]).not.toHaveProperty('rentGbp');
    expect(extras?.planningNote).toBe(
      'Sleep-in staff may need C2 planning permission.',
    );
    expect(backendSupportedLivingScheme.licensing.useClass).not.toBe('C2');
    expect(extras?.staffRoomOption).toBe('with_ensuite');
    expect(extras?.staffRoomOptions.withEnsuite.netCashFlowAnnual).toBe(18600);
    expect(extras?.riskBadge).toBe('Provider / regulatory risk: Medium-High');
    expect(backendSupportedLivingScheme.rooms.every((room) => room.id)).toBe(
      true,
    );
    expect(backendSupportedLivingScheme.fireEscape?.alarmGrade).toBe('LD1');

    const override = backendSupportedLivingScheme.refurbBoq?.lineItems.find(
      (item) => item.source === 'override',
    );
    expect(override?.category).toBe('override');
    expect(override?.lowGbp).toBeLessThan(0);
    expect(override?.highGbp).toBeLessThan(0);
  });

  it('rejects an invented outputs object', () => {
    expect(() =>
      parseBackendSupportedLivingScheme({
        ...payload,
        supportedLiving: {
          ...payload.supportedLiving,
          outputs: { rentAcrossLeaseGbp: 1 },
        },
      }),
    ).toThrow(/must not have an outputs object/);
  });

  it('rejects lease rows that still use rentGbp', () => {
    expect(() =>
      parseBackendSupportedLivingScheme({
        ...payload,
        supportedLiving: {
          ...payload.supportedLiving,
          leaseRentByYear: [{ year: 1, rentGbp: 58240 }],
        },
      }),
    ).toThrow(/weeklyRentPerRoomGbp and annualRentGbp/);
  });
});
