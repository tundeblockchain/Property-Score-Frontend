import type { HmoLayoutScheme } from '@/models';
import payload from '@/test/fixtures/supported-living-scheme.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Narrows factory JSON to `HmoLayoutScheme`.
 * JSON imports widen unions to `string`; this checks the extras names
 * so a rename fails at load time. Resident-room figures are factory
 * data until a `buildHmoPlanner` snapshot from PR #50 is checked in.
 *
 * Regenerate: `node scripts/generate-supported-living-fixture.mjs`.
 */
export function parseBackendSupportedLivingScheme(
  value: unknown,
): HmoLayoutScheme {
  if (!isRecord(value) || value.useCase !== 'social_care') {
    throw new Error('Supported living fixture must be a social_care scheme');
  }

  const extras = value.supportedLiving;
  if (!isRecord(extras)) {
    throw new Error('Supported living fixture is missing supportedLiving');
  }
  if ('outputs' in extras) {
    throw new Error('Supported living fixture must not have an outputs object');
  }

  const inputs = extras.inputs;
  if (!isRecord(inputs) || !isRecord(inputs.rentPerRoomWeekly)) {
    throw new Error('Supported living fixture is missing inputs.rentPerRoomWeekly');
  }
  if (typeof inputs.rentPerRoomWeekly.isEstimate !== 'boolean') {
    throw new Error('Supported living fixture rent must use isEstimate');
  }
  if (typeof extras.riskBadge !== 'string') {
    throw new Error('Supported living fixture is missing riskBadge');
  }
  if (
    extras.staffRoomOption !== 'with_ensuite' &&
    extras.staffRoomOption !== 'without_ensuite'
  ) {
    throw new Error('Supported living fixture is missing staffRoomOption');
  }
  if (!isRecord(extras.staffRoomOptions)) {
    throw new Error('Supported living fixture is missing staffRoomOptions');
  }
  if (
    extras.residentRoomOption !== 'standard' &&
    extras.residentRoomOption !== 'ensuite'
  ) {
    throw new Error('Supported living fixture is missing residentRoomOption');
  }
  if (!isRecord(extras.residentRoomOptions)) {
    throw new Error('Supported living fixture is missing residentRoomOptions');
  }
  if (
    !isRecord(extras.residentRoomOptions.standard) ||
    extras.residentRoomOptions.standard.option !== 'standard' ||
    !isRecord(extras.residentRoomOptions.ensuite) ||
    extras.residentRoomOptions.ensuite.option !== 'ensuite'
  ) {
    throw new Error(
      'Supported living fixture residentRoomOptions must include standard and ensuite with option',
    );
  }
  if (!Array.isArray(extras.leaseRentByYear) || extras.leaseRentByYear.length === 0) {
    throw new Error('Supported living fixture is missing leaseRentByYear');
  }

  const firstYear = extras.leaseRentByYear[0];
  if (
    !isRecord(firstYear) ||
    typeof firstYear.weeklyRentPerRoomGbp !== 'number' ||
    typeof firstYear.annualRentGbp !== 'number'
  ) {
    throw new Error(
      'Supported living fixture leaseRentByYear must use weeklyRentPerRoomGbp and annualRentGbp',
    );
  }
  if ('rentGbp' in firstYear) {
    throw new Error('Supported living fixture leaseRentByYear must not use rentGbp');
  }

  // Validated JSON boundary: imports widen unions to `string`.
  return value as unknown as HmoLayoutScheme;
}

export const backendSupportedLivingScheme =
  parseBackendSupportedLivingScheme(payload);
