import { Typography } from '@mui/material';

/**
 * Stands in for a check that produced no data, so a reader can tell the
 * difference between "we found nothing" and "we never looked".
 */
export function SectionUnavailable() {
  return (
    <Typography color="text.secondary">
      Not available for this property.
    </Typography>
  );
}
