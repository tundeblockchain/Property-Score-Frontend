import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Stack, Tooltip, Typography } from '@mui/material';

interface FactProps {
  label: string;
  value: string;
  /** Short explanation shown on hover/focus of the info icon. */
  info?: string;
  /** 'strong' promotes the value to a display figure, for headline facts. */
  emphasis?: 'normal' | 'strong';
  /**
   * Overrides the value colour. Reserve this for values whose colour carries
   * meaning, such as an EPC band, rather than for decoration.
   */
  valueColor?: string;
}

export function Fact({
  label,
  value,
  info,
  emphasis = 'normal',
  valueColor,
}: FactProps) {
  const isStrong = emphasis === 'strong';

  return (
    <Stack spacing={0.25} sx={{ minWidth: 140 }}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography variant="body2" color="text.secondary">
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
                color: 'text.secondary',
                cursor: 'help',
                lineHeight: 0,
                borderRadius: '50%',
                '&:hover': { color: 'primary.main' },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 18 }} />
            </Box>
          </Tooltip>
        ) : null}
      </Stack>
      <Typography
        variant={isStrong ? 'h5' : 'body1'}
        // A fact is data, not a section title, so it stays out of the outline.
        component="p"
        fontWeight={isStrong ? 800 : 600}
        sx={valueColor ? { color: valueColor } : { color: 'text.primary' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
