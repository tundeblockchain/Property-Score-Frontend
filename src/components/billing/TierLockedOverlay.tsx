import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface TierLockedOverlayProps {
  title: string;
  description: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
}

export function TierLockedOverlay({
  title,
  description,
  children,
  ctaLabel = 'View plans',
  ctaTo = '/pricing',
}: TierLockedOverlayProps) {
  return (
    <Box
      position="relative"
      borderRadius={2}
      overflow="hidden"
      role="region"
      aria-label={`${title}. ${description}`}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        aria-hidden
        sx={{
          p: 2,
          filter: 'blur(5px)',
          opacity: 0.55,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.55)} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`,
          backdropFilter: 'blur(2px)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            maxWidth: 320,
            width: '100%',
            textAlign: 'center',
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
            boxShadow: (theme) => theme.shadows[2],
          }}
        >
          <Stack spacing={1.5} alignItems="center">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
              }}
            >
              <LockOutlinedIcon fontSize="small" />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">{title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Stack>
            <Button
              component={RouterLink}
              to={ctaTo}
              variant="contained"
              size="small"
            >
              {ctaLabel}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
