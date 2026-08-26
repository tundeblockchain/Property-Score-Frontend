import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { ReportPreviewCard } from '@/components/landing/ReportPreviewCard';
import { PROPERTIES_PATH } from '@/lib/paths';

export function LandingHero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 4, md: 6 }}
      alignItems="center"
    >
      <Stack spacing={2.5} flex={1} sx={{ minWidth: 0 }}>
        <Typography
          variant="overline"
          color="primary.dark"
          fontWeight={700}
          letterSpacing="0.14em"
        >
          Property investment scoring
        </Typography>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' } }}
        >
          Score any Rightmove listing in seconds.
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary" fontWeight={400}>
          Paste a listing link and get an investor-grade score with the
          financial model, compliance checks, floor plan read and area data
          behind it.
        </Typography>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          <Button component="a" href="#try" variant="contained" size="large">
            {user ? 'Analyse a listing' : 'Try it free'}
          </Button>
          {user ? (
            <Button
              component={RouterLink}
              to={PROPERTIES_PATH}
              variant="outlined"
              size="large"
            >
              Your properties
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              onClick={() => setAuthDialogOpen(true)}
            >
              Get started
            </Button>
          )}
          <Button
            component={RouterLink}
            to="/pricing"
            variant="outlined"
            size="large"
            color="secondary"
          >
            Compare plans
          </Button>
          <Button component="a" href="#faq" size="large">
            FAQ
          </Button>
        </Stack>

        {user ? null : (
          <Typography variant="body2" color="text.secondary">
            5 free listing analyses on sign-up. No card required.
          </Typography>
        )}
      </Stack>

      <Box flex={1} width="100%" maxWidth={480}>
        <ReportPreviewCard />
      </Box>

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onAuthenticated={() => {
          setAuthDialogOpen(false);
          navigate(PROPERTIES_PATH);
        }}
        initialMode="signUp"
        description="Create an account to start scoring listings with 5 free analyses."
      />
    </Stack>
  );
}
