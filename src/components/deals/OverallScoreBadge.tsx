import { Box, Typography } from '@mui/material';

interface OverallScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export function OverallScoreBadge({
  score,
  size = 'md',
}: OverallScoreBadgeProps) {
  const dimension = size === 'sm' ? 48 : 72;

  return (
    <Box
      aria-label={`Overall score ${score}`}
      sx={{
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        flexShrink: 0,
      }}
    >
      <Typography
        component="span"
        fontWeight={700}
        fontSize={size === 'sm' ? '1rem' : '1.5rem'}
      >
        {score}
      </Typography>
    </Box>
  );
}
