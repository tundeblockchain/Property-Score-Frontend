import type {
  ConversionAction,
  FireCheckStatus,
  FireRiskBand,
  HmoPlannerResult,
  LicensingRequirementStatus,
  RefurbBoqCategory,
} from '@/models';

export function conversionActionLabel(action: ConversionAction): string {
  switch (action) {
    case 'keep_bedroom':
      return 'Keep bedroom';
    case 'convert_to_bedroom':
      return 'Convert to bedroom';
    case 'add_ensuite':
      return 'Add ensuite';
    case 'keep_communal':
      return 'Keep communal';
    case 'staff_room':
      return 'Staff room';
  }
}

export function sourceLabel(source: HmoPlannerResult['source']): string {
  return source === 'floor_plan_vision'
    ? 'Floor-plan vision'
    : 'Listed beds (indicative)';
}

export function licensingStatusLabel(status: LicensingRequirementStatus): string {
  switch (status) {
    case 'likely_required':
      return 'Likely required';
    case 'likely_not_required':
      return 'Likely not required';
    case 'check_with_la':
      return 'Check with local authority';
    case 'not_applicable':
      return 'Not applicable';
  }
}

export function licensingChipColor(
  status: LicensingRequirementStatus,
): 'default' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'likely_required':
      return 'error';
    case 'likely_not_required':
      return 'success';
    case 'check_with_la':
      return 'warning';
    case 'not_applicable':
      return 'default';
  }
}

export function fireCheckStatusLabel(status: FireCheckStatus): string {
  switch (status) {
    case 'likely_ok':
      return 'Likely OK';
    case 'likely_required':
      return 'Likely required';
    case 'check_on_site':
      return 'Check on site';
    case 'not_assessed':
      return 'Not assessed';
  }
}

export function fireCheckChipColor(
  status: FireCheckStatus,
): 'default' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'likely_ok':
      return 'success';
    case 'likely_required':
      return 'error';
    case 'check_on_site':
      return 'warning';
    case 'not_assessed':
      return 'default';
  }
}

export function fireRiskLabel(band: FireRiskBand): string {
  switch (band) {
    case 'lower':
      return 'Lower';
    case 'medium':
      return 'Medium';
    case 'higher':
      return 'Higher';
  }
}

export function refurbCategoryLabel(category: RefurbBoqCategory): string {
  switch (category) {
    case 'room_fabric':
      return 'Room fabric';
    case 'conversion':
      return 'Conversion';
    case 'ensuite_wetroom':
      return 'Ensuite / wet room';
    case 'kitchen_communal':
      return 'Kitchen';
    case 'bathroom':
      return 'Bathroom';
    case 'fire_compliance':
      return 'Fire compliance';
    case 'care_adaptations':
      return 'Care adaptations';
    case 'contingency':
      return 'Contingency';
  }
}
