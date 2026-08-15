import { describe, expect, it } from 'vitest';
import { hmoRenderSkipReasonLabel } from '@/components/deals/hmoPlanner/labels';
import type { HmoRenderSkipReason } from '@/models';

const cases: Array<[HmoRenderSkipReason, string]> = [
  [
    'no_conversion_plan',
    'This scheme has no conversion plan to illustrate.',
  ],
  [
    'empty_conversion_steps',
    'There are no conversion steps to illustrate.',
  ],
  [
    'no_floor_plan_image',
    'A listing floor-plan image is needed to generate a proposed layout.',
  ],
  [
    'no_api_key',
    'Proposed layouts are not available at the moment. Try again later.',
  ],
];

describe('hmoRenderSkipReasonLabel', () => {
  it.each(cases)('explains %s', (reason, label) => {
    expect(hmoRenderSkipReasonLabel(reason)).toBe(label);
  });
});
