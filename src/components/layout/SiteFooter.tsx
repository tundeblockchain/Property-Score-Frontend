import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

const PUBLIC_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/#faq', label: 'FAQ' },
  { to: '/login', label: 'Sign in' },
] as const;

const SIGNED_IN_LINKS = [
  { to: '/analyse', label: 'Analyse' },
  { to: '/deals', label: 'Properties' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/account', label: 'Account' },
] as const;

export function SiteFooter() {
  const { user } = useAuth();
  const links = user ? SIGNED_IN_LINKS : PUBLIC_LINKS;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'primary.contrastText',
        mt: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        '@media print': { display: 'none' },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack spacing={0.5} maxWidth={520}>
            <Typography variant="subtitle2" fontWeight={700}>
              Property Score
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: (theme) => alpha(theme.palette.primary.contrastText, 0.78) }}
            >
              Investor reports for UK listings on Rightmove, Zoopla and
              OnTheMarket — yields, HMO licensing, floor plans and area data.
            </Typography>
          </Stack>
          <Stack
            component="nav"
            aria-label="Footer"
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
          >
            {links.map((link) => (
              <Link
                key={link.to}
                component={RouterLink}
                to={link.to}
                underline="hover"
                variant="body2"
                sx={{
                  color: (theme) => alpha(theme.palette.primary.contrastText, 0.78),
                  '&:hover': { color: 'primary.contrastText' },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
