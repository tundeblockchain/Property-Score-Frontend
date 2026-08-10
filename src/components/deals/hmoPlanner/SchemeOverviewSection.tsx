import { Box, Chip, Stack, Typography } from '@mui/material';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { HmoLayoutScheme } from '@/models';
import { Fact } from '@/components/deals/common/Fact';

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
        <Fact
          label="Letting rooms"
          value={String(scheme.lettingRooms)}
          info="Number of rooms intended for letting under this scheme, after any conversion plan."
        />
        <Fact
          label="Area fit"
          value={`${scheme.fitScore}/100`}
          info="How well the layout and room sizes fit this use case. Higher scores mean a better match to space and scheme goals."
        />
        <Fact
          label="Est. monthly rent"
          value={formatCurrency(scheme.financials.estimatedRentMonthly)}
          info="Indicative total monthly rent from all letting rooms in this scheme."
        />
        <Fact
          label="Gross yield"
          value={formatPercent(scheme.financials.grossYield)}
          info="Annual rent before costs, divided by asking price. A quick income screening metric, not net return."
        />
        <Fact
          label="Void assumed"
          value={`${Math.round(scheme.financials.voidRateAssumed * 100)}%`}
          info="Assumed empty-room downtime between tenancies. Higher voids reduce effective income."
        />
        <Fact
          label="Room rent / wk"
          value={formatCurrency(scheme.financials.roomRentWeeklyAssumed)}
          info="Assumed weekly rent per letting room used to build this scheme’s income model."
        />
        <Fact
          label="Refurb range"
          value={`${formatCurrency(scheme.estimatedRefurbLowGbp)} – ${formatCurrency(scheme.estimatedRefurbHighGbp)}`}
          info="Indicative low–high refurb cost to deliver this scheme, including conversion and compliance items where modelled."
        />
        <Fact
          label="Net cash flow / yr"
          value={formatCurrency(scheme.financials.netCashFlowAnnual)}
          info="Estimated annual cash left after operating costs and voids. Negative values mean the scheme may not cover costs at these assumptions."
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
