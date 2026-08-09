import type {
  ConversionAction,
  HmoPlannerResult,
  LicensingRequirementStatus,
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
