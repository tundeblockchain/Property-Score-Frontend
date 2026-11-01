import { describe, expect, it } from 'vitest';
import {
  conversionActionLabel,
  hmoRenderSkipReasonLabel,
  hmoSchemeSectionTitle,
  hmoUseCaseLabel,
  isSupportedLivingScheme,
  staffRoomOptionLabel,
  supportedLivingRiskBadge,
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

  it('rebuilds the product title only for older stored social-care deals', () => {
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

  it('keeps the backend title when it already uses the product pattern', () => {
    expect(
      hmoSchemeSectionTitle(
        buildHmoScheme({
          id: 'social_care',
          useCase: 'social_care',
          title: 'Supported living · 4-bed supported living',
          lettingRooms: 4,
        }),
      ),
    ).toBe('Supported living · 4-bed supported living');
  });
});

describe('isSupportedLivingScheme', () => {
  it('matches the social_care use case or scheme key', () => {
    expect(
      isSupportedLivingScheme({ id: 'care', useCase: 'social_care' }),
    ).toBe(true);
    expect(
      isSupportedLivingScheme({ id: 'social_care', useCase: 'workers' }),
    ).toBe(true);
    expect(
      isSupportedLivingScheme({ id: 'students', useCase: 'students' }),
    ).toBe(false);
  });
});

describe('supportedLivingRiskBadge', () => {
  it('uses the payload badge and falls back to the product copy', () => {
    expect(
      supportedLivingRiskBadge({
        riskBadge: 'Provider / regulatory risk: Medium-High',
      }),
    ).toBe('Provider / regulatory risk: Medium-High');
    expect(supportedLivingRiskBadge(undefined)).toBe(
      'Provider / regulatory risk: Medium-High',
    );
  });
});

describe('staffRoomOptionLabel', () => {
  it('labels both staff-room options', () => {
    expect(staffRoomOptionLabel('with_ensuite')).toBe('With ensuite');
    expect(staffRoomOptionLabel('without_ensuite')).toBe('Without ensuite');
  });
});
