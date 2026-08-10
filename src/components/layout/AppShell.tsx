import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
} from '@mui/material';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { BrandMark, CreditsBadge } from '@/components/layout/BrandAndCredits';

const NAV_LINKS = [
  { to: '/', label: 'Analyse' },
  { to: '/deals', label: 'Properties' },
  { to: '/billing', label: 'Billing' },
] as const;

export function AppHeader() {
  const { user, signOut } = useAuth();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar>
        <BrandMark />
        <Box flex={1} />
        {user ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                color="inherit"
                sx={{
                  fontSize: '1rem',
                  px: 1.5,
                  '&.active': {
                    color: 'primary.main',
                    fontWeight: 700,
                  },
                }}
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
      </Toolbar>
    </AppBar>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const isDealReport = /^\/deals\/[^/]+$/.test(pathname);

  return (
    <Box
      minHeight="100vh"
      sx={{
        background:
          'radial-gradient(ellipse at top left, rgba(20,184,166,0.12), transparent 45%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
      }}
    >
      <AppHeader />
      <Container
        maxWidth={isDealReport ? 'lg' : 'md'}
        sx={{ py: { xs: 3, md: 5 } }}
      >
        {children}
      </Container>
    </Box>
  );
}
