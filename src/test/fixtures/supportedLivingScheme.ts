import type { HmoLayoutScheme } from '@/models';
import payload from '@/test/fixtures/supported_living_scheme_snapshot.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Narrows a `social_care` scheme from the captured `buildHmoPlanner`
 * snapshot. JSON imports widen unions to `string`; this checks extras
 * names so a rename fails at load time.
 *
 * Source: Property-Score PR #50 @ 2ba328f
 * (`packages/shared/fixtures/supported-living-scheme.json`).
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
  if (!isRecord(inputs.residentEnsuiteRentPremiumWeekly)) {
    throw new Error(
      'Supported living fixture is missing inputs.residentEnsuiteRentPremiumWeekly',
    );
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

export interface SupportedLivingPlannerSnapshot {
  generatedBy: 'buildHmoPlanner';
  standardWinning: {
    residentRoomOption: 'standard';
    scheme: HmoLayoutScheme;
  };
  ensuiteWinning: {
    residentRoomOption: 'ensuite';
    scheme: HmoLayoutScheme;
  };
}

/**
 * Captured `buildHmoPlanner` snapshot from Property-Score PR #50 @ 2ba328f.
 * Do not add hand-written fields; replace the JSON file when the planner changes.
 */
export function parseSupportedLivingPlannerSnapshot(
  value: unknown,
): SupportedLivingPlannerSnapshot {
  if (!isRecord(value) || value.generatedBy !== 'buildHmoPlanner') {
    throw new Error('Supported living snapshot must be emitted by buildHmoPlanner');
  }
  if (!isRecord(value.standardWinning) || !isRecord(value.ensuiteWinning)) {
    throw new Error(
      'Supported living snapshot must include standardWinning and ensuiteWinning',
    );
  }
  if (value.standardWinning.residentRoomOption !== 'standard') {
    throw new Error('standardWinning.residentRoomOption must be standard');
  }
  if (value.ensuiteWinning.residentRoomOption !== 'ensuite') {
    throw new Error('ensuiteWinning.residentRoomOption must be ensuite');
  }

  return {
    generatedBy: 'buildHmoPlanner',
    standardWinning: {
      residentRoomOption: 'standard',
      scheme: parseBackendSupportedLivingScheme(value.standardWinning.scheme),
    },
    ensuiteWinning: {
      residentRoomOption: 'ensuite',
      scheme: parseBackendSupportedLivingScheme(value.ensuiteWinning.scheme),
    },
  };
}

export const supportedLivingPlannerSnapshot =
  parseSupportedLivingPlannerSnapshot(payload);

export const backendSupportedLivingScheme =
  supportedLivingPlannerSnapshot.standardWinning.scheme;

export const ensuiteWinningSupportedLivingScheme =
  supportedLivingPlannerSnapshot.ensuiteWinning.scheme;

export const rawStandardWinningScheme = payload.standardWinning.scheme;
