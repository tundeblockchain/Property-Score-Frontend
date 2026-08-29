import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';
import { setAnalyticsConsent } from '@/lib/analyticsConsent';

interface CookieConsentBannerProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function CookieConsentBanner({
  forceOpen = false,
  onClose,
}: CookieConsentBannerProps) {
  const consent = useAnalyticsConsent();

  if (consent !== null && !forceOpen) {
    return null;
  }

  function handleAccept(): void {
    setAnalyticsConsent('granted');
    onClose?.();
  }

  function handleReject(): void {
    setAnalyticsConsent('denied');
    onClose?.();
  }

  return (
    <Box
      component="aside"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.snackbar,
        p: { xs: 1.5, sm: 2 },
        '@media print': { display: 'none' },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 960,
          mx: 'auto',
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Stack spacing={0.75} flex={1}>
            <Typography id="cookie-consent-title" variant="subtitle1" fontWeight={700}>
              Cookies for analytics and ads
            </Typography>
            <Typography
              id="cookie-consent-description"
              variant="body2"
              color="text.secondary"
            >
              Optional cookies help us understand how Property Score is used
              and measure our marketing. Necessary sign-in cookies are always
              on.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" color="secondary" onClick={handleReject}>
              Reject
            </Button>
            <Button variant="contained" onClick={handleAccept}>
              Accept
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
