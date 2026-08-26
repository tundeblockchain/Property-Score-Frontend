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
import {
  isLowAnalysisBalance,
  remainingAnalysesBadgeLabel,
} from '@/lib/plans';

export function CreditsBadge() {
  const { data, isLoading, isError } = useBilling();

  if (isLoading) {
    return (
      <Chip
        label="Analyses…"
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
      color={isLowAnalysisBalance(data.creditsRemaining) ? 'warning' : 'primary'}
      label={remainingAnalysesBadgeLabel(data.creditsRemaining)}
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
      You have no analyses left. Upgrade or buy a top-up to analyse listings.
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
