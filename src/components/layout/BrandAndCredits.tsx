import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useBilling } from '@/hooks/useBilling';

export function CreditsBadge() {
  const { data, isLoading, isError } = useBilling();

  if (isLoading) {
    return (
      <Chip
        label="Credits…"
        variant="outlined"
        sx={{ fontSize: '0.95rem', height: 36 }}
      />
    );
  }

  if (isError || !data) {
    return null;
  }

  return (
    <Chip
      component={RouterLink}
      to="/billing"
      clickable
      color={data.creditsRemaining > 0 ? 'primary' : 'warning'}
      label={`${data.creditsRemaining} credits`}
      variant="outlined"
      sx={{ fontSize: '0.95rem', height: 36 }}
    />
  );
}

interface InsufficientCreditsBannerProps {
  show: boolean;
}

export function InsufficientCreditsBanner({
  show,
}: InsufficientCreditsBannerProps) {
  if (!show) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      action={
        <Button component={RouterLink} to="/billing" color="inherit" size="small">
          Billing
        </Button>
      }
    >
      You have no credits left. Upgrade or buy a top-up to analyse listings.
    </Alert>
  );
}

interface BrandMarkProps {
  to?: string;
}

export function BrandMark({ to = '/' }: BrandMarkProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" component={RouterLink} to={to} sx={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1,
          bgcolor: 'primary.main',
        }}
        aria-hidden
      />
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontFamily: '"Plus Jakarta Sans", "Manrope", sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.01em',
        }}
      >
        Property Score
      </Typography>
    </Stack>
  );
}
