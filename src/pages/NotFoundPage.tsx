import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Stack spacing={2} py={4} component="article">
      <Typography variant="h4" component="h1">
        Page not found
      </Typography>
      <Typography color="text.secondary">
        That address is not a Property Score page. Head home to score a
        Rightmove, Zoopla or OnTheMarket listing.
      </Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to="/" variant="contained">
          Go to home
        </Button>
        <Button component={RouterLink} to="/pricing" variant="outlined">
          Pricing
        </Button>
      </Stack>
    </Stack>
  );
}
