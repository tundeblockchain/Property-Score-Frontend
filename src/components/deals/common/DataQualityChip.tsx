import { Chip, Tooltip } from '@mui/material';

type DataQuality = 'estimated' | 'limited';

const QUALITY_COPY: Record<DataQuality, { label: string; help: string }> = {
  estimated: {
    label: 'Estimated',
    help: 'Modelled from area averages because no measured data was found for this property.',
  },
  limited: {
    label: 'Limited data',
    help: 'Fewer records than usual were available, so treat these figures as indicative.',
  },
};

interface DataQualityChipProps {
  quality: DataQuality;
}

/**
 * Flags a panel whose figures are inferred rather than measured, so a reader
 * knows how much weight to give them.
 */
export function DataQualityChip({ quality }: DataQualityChipProps) {
  const { label, help } = QUALITY_COPY[quality];

  return (
    <Tooltip title={help} arrow enterTouchDelay={0}>
      <Chip
        label={label}
        size="small"
        variant="outlined"
        // Focusable so the explanation is reachable without a pointer.
        tabIndex={0}
        sx={{ alignSelf: 'flex-start', cursor: 'help' }}
      />
    </Tooltip>
  );
}
