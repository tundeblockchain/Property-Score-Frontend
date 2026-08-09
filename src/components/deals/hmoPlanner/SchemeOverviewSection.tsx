import { Box, Chip, Stack, Typography } from '@mui/material';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { HmoLayoutScheme } from '@/models';
import { Fact } from './Fact';

interface SchemeOverviewSectionProps {
  scheme: HmoLayoutScheme;
}

export function SchemeOverviewSection({ scheme }: SchemeOverviewSectionProps) {
  return (
    <Stack spacing={2}>
      {scheme.recommended ? (
        <Chip
          label="Recommended"
          color="primary"
          size="small"
          sx={{ alignSelf: 'flex-start' }}
        />
      ) : null}

      <Typography color="primary.dark">{scheme.summary}</Typography>

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact label="Letting rooms" value={String(scheme.lettingRooms)} />
        <Fact label="Area fit" value={`${scheme.fitScore}/100`} />
        <Fact
          label="Est. monthly rent"
          value={formatCurrency(scheme.financials.estimatedRentMonthly)}
        />
        <Fact
          label="Gross yield"
          value={formatPercent(scheme.financials.grossYield)}
        />
        <Fact
          label="Void assumed"
          value={`${Math.round(scheme.financials.voidRateAssumed * 100)}%`}
        />
        <Fact
          label="Room rent / wk"
          value={formatCurrency(scheme.financials.roomRentWeeklyAssumed)}
        />
        <Fact
          label="Refurb range"
          value={`${formatCurrency(scheme.estimatedRefurbLowGbp)} – ${formatCurrency(scheme.estimatedRefurbHighGbp)}`}
        />
        <Fact
          label="Net cash flow / yr"
          value={formatCurrency(scheme.financials.netCashFlowAnnual)}
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" color="primary.dark">
          Indicative room schedule
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
            },
          }}
        >
          {scheme.rooms.map((room) => (
            <Box
              key={room.label}
              sx={{
                borderLeft: 3,
                borderColor:
                  room.meetsSpaceStandard === false
                    ? 'warning.main'
                    : 'primary.main',
                pl: 1.5,
                py: 0.5,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Typography fontWeight={600} color="primary.dark">
                  {room.label}{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary.main"
                  >
                    ({room.type}
                    {room.estimatedAreaSqM != null
                      ? ` · ~${room.estimatedAreaSqM} m²`
                      : ''}
                    )
                  </Typography>
                </Typography>
                {room.meetsSpaceStandard === false ? (
                  <Chip label="Below space std" size="small" color="warning" />
                ) : null}
                {room.meetsSpaceStandard === true ? (
                  <Chip label="Space ok" size="small" variant="outlined" />
                ) : null}
              </Stack>
              {room.notes ? (
                <Typography variant="caption" color="text.secondary">
                  {room.notes}
                </Typography>
              ) : null}
            </Box>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}
