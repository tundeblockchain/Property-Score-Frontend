import { Stack, Typography } from '@mui/material';

interface FactProps {
  label: string;
  value: string;
}

export function Fact({ label, value }: FactProps) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 140 }}>
      <Typography variant="caption" color="primary.main">
        {label}
      </Typography>
      <Typography fontWeight={600} color="primary.dark">
        {value}
      </Typography>
    </Stack>
  );
}
