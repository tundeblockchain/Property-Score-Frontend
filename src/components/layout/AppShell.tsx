import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
} from '@mui/material';
import { useState, type ReactNode } from 'react';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { BrandMark, CreditsBadge } from '@/components/layout/BrandAndCredits';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageMeta } from '@/components/seo/PageMeta';
import { PROPERTIES_PATH } from '@/lib/paths';

const NAV_LINKS = [
  { to: '/analyse', label: 'Analyse' },
  { to: '/deals', label: 'Properties' },
  { to: '/billing', label: 'Billing' },
  { to: '/account', label: 'Account' },
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
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const showPublicNav = !user && pathname !== '/login';

  async function handleSignOut() {
    void navigate('/', { replace: true });
    await signOut();
  }

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        '@media print': { display: 'none' },
      }}
    >
      <Toolbar>
        <BrandMark to={user ? PROPERTIES_PATH : '/'} />
        <Box flex={1} />
        {user ? (
          <Stack
            component="nav"
            aria-label="Account"
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
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
              onClick={() => {
                void handleSignOut();
              }}
              sx={{ fontSize: '1rem', px: 1.5 }}
            >
              Sign out
            </Button>
          </Stack>
        ) : null}
        {showPublicNav ? (
          <Stack
            component="nav"
            aria-label="Primary"
            direction="row"
            spacing={1}
            alignItems="center"
          >
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
        onAuthenticated={() => {
          setAuthDialogOpen(false);
          void navigate(PROPERTIES_PATH);
        }}
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
      display="flex"
      flexDirection="column"
      sx={{
        background:
          'radial-gradient(ellipse at top left, rgba(20,184,166,0.12), transparent 45%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
      }}
    >
      <PageMeta />
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: -10000,
          top: 8,
          zIndex: (theme) => theme.zIndex.tooltip,
          px: 2,
          py: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: 1,
          boxShadow: 2,
          '&:focus': {
            left: 8,
          },
        }}
      >
        Skip to content
      </Box>
      <AppHeader />
      <Container
        component="main"
        id="main-content"
        maxWidth={isWide ? 'lg' : 'md'}
        sx={{
          flex: 1,
          py: { xs: 3, md: 5 },
          '@media print': { py: 0, maxWidth: '100%' },
        }}
      >
        {children}
      </Container>
      <SiteFooter />
    </Box>
  );
}
