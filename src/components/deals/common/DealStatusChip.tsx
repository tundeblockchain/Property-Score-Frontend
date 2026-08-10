import { Chip } from '@mui/material';
import type { DealStatus } from '@/models';

const STATUS_COLOR: Record<
  DealStatus,
  'default' | 'success' | 'warning' | 'error'
> = {
  PROCESSING: 'warning',
  COMPLETED: 'success',
  FAILED: 'error',
};

interface DealStatusChipProps {
  status: DealStatus;
}

export function DealStatusChip({ status }: DealStatusChipProps) {
  return (
    <Chip
      size="small"
      label={status.charAt(0) + status.slice(1).toLowerCase()}
      color={STATUS_COLOR[status]}
      variant="outlined"
    />
  );
}
