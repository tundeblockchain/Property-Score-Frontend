import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
} from '@mui/material';
import { useState, type ReactNode } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { BrandMark, CreditsBadge } from '@/components/layout/BrandAndCredits';

const NAV_LINKS = [
  { to: '/analyse', label: 'Analyse' },
  { to: '/deals', label: 'Properties' },
  { to: '/billing', label: 'Billing' },
] as const;

/** Marketing pages need more horizontal room than the app forms. */
const WIDE_ROUTES = [/^\/$/, /^\/pricing$/, /^\/deals\/[^/]+$/];

const navButtonSx = {
  fontSize: '1rem',
  px: 1.5,
  '&.active': {
    color: 'primary.main',
    fontWeight: 700,
  },
} as const;

export function AppHeader() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const showPublicNav = !user && pathname !== '/login';

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar>
        <BrandMark to={user ? '/analyse' : '/'} />
        <Box flex={1} />
        {user ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                color="inherit"
                sx={navButtonSx}
              >
                {link.label}
              </Button>
            ))}
            <CreditsBadge />
            <Button
              color="inherit"
              onClick={() => void signOut()}
              sx={{ fontSize: '1rem', px: 1.5 }}
            >
              Sign out
            </Button>
          </Stack>
        ) : null}
        {showPublicNav ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              component={NavLink}
              to="/pricing"
              color="inherit"
              sx={navButtonSx}
            >
              Pricing
            </Button>
            <Button
              component={RouterLink}
              to="/#faq"
              color="inherit"
              sx={navButtonSx}
            >
              FAQ
            </Button>
            <Button variant="contained" onClick={() => setAuthDialogOpen(true)}>
              Sign in
            </Button>
          </Stack>
        ) : null}
      </Toolbar>
      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onAuthenticated={() => setAuthDialogOpen(false)}
        initialMode="signIn"
      />
    </AppBar>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const isWide = WIDE_ROUTES.some((pattern) => pattern.test(pathname));

  return (
    <Box
      minHeight="100vh"
      sx={{
        background:
          'radial-gradient(ellipse at top left, rgba(20,184,166,0.12), transparent 45%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
      }}
    >
      <AppHeader />
      <Container maxWidth={isWide ? 'lg' : 'md'} sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
