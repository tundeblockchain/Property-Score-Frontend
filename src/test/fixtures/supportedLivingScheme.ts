import type { HmoLayoutScheme } from '@/models';
import payload from '@/test/fixtures/supported-living-scheme.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Narrows captured planner JSON to `HmoLayoutScheme`.
 * JSON imports widen unions to `string`; this checks the e02603b
 * `SupportedLivingSchemeExtras` names so a rename fails at load time.
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
  if (!Array.isArray(extras.leaseRentByYear)) {
    throw new Error('Supported living fixture is missing leaseRentByYear');
  }

  // Validated JSON boundary: imports widen unions to `string`.
  return value as unknown as HmoLayoutScheme;
}

export const backendSupportedLivingScheme =
  parseBackendSupportedLivingScheme(payload);
