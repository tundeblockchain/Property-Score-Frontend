import { describe, expect, it } from 'vitest';
import {
  conversionActionLabel,
  hmoRenderSkipReasonLabel,
  hmoSchemeSectionTitle,
  hmoUseCaseLabel,
} from '@/components/deals/hmoPlanner/labels';
import type { ConversionAction, HmoRenderSkipReason, HmoUseCase } from '@/models';
import { buildHmoScheme } from '@/test/factories';

const skipCases: Array<[HmoRenderSkipReason, string]> = [
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

const conversionCases: Array<[ConversionAction, string]> = [
  ['keep_bedroom', 'Keep bedroom'],
  ['convert_to_bedroom', 'Convert to bedroom'],
  ['add_ensuite', 'Add ensuite'],
  ['keep_communal', 'Keep communal'],
  ['combine_kitchen_dining', 'Kitchen / lounge'],
  ['staff_room', 'Staff room'],
];

describe('hmoRenderSkipReasonLabel', () => {
  it.each(skipCases)('explains %s', (reason, label) => {
    expect(hmoRenderSkipReasonLabel(reason)).toBe(label);
  });
});

describe('conversionActionLabel', () => {
  it.each(conversionCases)('labels %s', (action, label) => {
    expect(conversionActionLabel(action)).toBe(label);
  });
});

const useCaseCases: Array<[HmoUseCase, string]> = [
  ['students', 'Students HMO'],
  ['workers', 'Workers HMO'],
  ['social_care', 'Supported living'],
];

describe('hmoUseCaseLabel', () => {
  it.each(useCaseCases)('labels %s', (useCase, label) => {
    expect(hmoUseCaseLabel(useCase)).toBe(label);
  });
});

describe('hmoSchemeSectionTitle', () => {
  it('keeps the API title for student and worker schemes', () => {
    expect(
      hmoSchemeSectionTitle(
        buildHmoScheme({
          title: 'Students · 3-bed student HMO',
          lettingRooms: 3,
        }),
      ),
    ).toBe('Students · 3-bed student HMO');
  });

  it('names supported living with the bed count, even when keyed only by id', () => {
    expect(
      hmoSchemeSectionTitle(
        buildHmoScheme({
          id: 'social_care',
          useCase: 'social_care',
          title: 'Social care HMO',
          lettingRooms: 4,
        }),
      ),
    ).toBe('Supported living · 4-bed supported living');
  });
});
