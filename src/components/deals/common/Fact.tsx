import { Box, Stack, Tooltip, Typography } from '@mui/material';

interface FactProps {
  label: string;
  value: string;
  /** Short explanation shown on hover/focus of the info icon. */
  info?: string;
}

function InfoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </svg>
  );
}

export function Fact({ label, value, info }: FactProps) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 140 }}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography variant="body2" color="primary.main">
          {label}
        </Typography>
        {info ? (
          <Tooltip title={info} arrow enterTouchDelay={0}>
            <Box
              component="button"
              type="button"
              aria-label={`About ${label}`}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0,
                m: 0,
                border: 0,
                bgcolor: 'transparent',
                color: 'info.main',
                cursor: 'help',
                lineHeight: 0,
                borderRadius: '50%',
                '&:hover': { color: 'info.dark' },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'info.main',
                  outlineOffset: 2,
                },
              }}
            >
              <InfoIcon />
            </Box>
          </Tooltip>
        ) : null}
      </Stack>
      <Typography variant="body1" fontWeight={600} color="primary.dark">
        {value}
      </Typography>
    </Stack>
  );
}
