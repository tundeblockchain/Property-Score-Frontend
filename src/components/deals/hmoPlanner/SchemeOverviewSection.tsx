import { Box, Chip, Stack, Typography } from '@mui/material';
import { Fact } from '@/components/deals/common/Fact';
import {
  SUPPORTED_LIVING_C2_NOTE,
  isSupportedLivingScheme,
} from '@/components/deals/hmoPlanner/labels';
import { staffRoomChoice } from '@/components/deals/hmoPlanner/schemes';
import { formatCurrency, formatPercent } from '@/lib/format';
import type {
  HmoEditableInput,
  HmoLayoutScheme,
  HmoSupportedLivingInputs,
} from '@/models';

interface SchemeOverviewSectionProps {
  scheme: HmoLayoutScheme;
}

function formatYesNo(value: boolean): string {
  return value ? 'Yes' : 'No';
}

function inputValue<T>(
  field: HmoEditableInput<T> | undefined,
  fallback?: T,
): { value: T | undefined; estimated: boolean } {
  if (field) {
    return { value: field.value, estimated: field.estimated === true };
  }
  return { value: fallback, estimated: false };
}

function SupportedLivingInputs({
  inputs,
  scheme,
}: {
  inputs: HmoSupportedLivingInputs | undefined;
  scheme: HmoLayoutScheme;
}) {
  const rent = inputValue(
    inputs?.rentPerRoomPerWeek,
    scheme.financials.roomRentWeeklyAssumed,
  );
  const leaseTerm = inputValue(inputs?.leaseTermYears);
  const breakYear = inputValue(inputs?.breakYear);
  const cpi = inputValue(inputs?.cpiUpliftPct);
  const fri = inputValue(inputs?.fri);
  const vp = inputValue(inputs?.vacantPossessionValueGbp);
  const refurbLow = inputValue(inputs?.refurbLowGbp, scheme.estimatedRefurbLowGbp);
  const refurbHigh = inputValue(
    inputs?.refurbHighGbp,
    scheme.estimatedRefurbHighGbp,
  );
  const compliance = inputValue(inputs?.complianceLumpSumGbp);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Assumptions</Typography>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Rent per room / wk"
          value={formatCurrency(rent.value)}
          estimate={rent.estimated}
          info="Weekly rent per supported-living room used to build the lease income."
        />
        <Fact
          label="Lease term"
          value={leaseTerm.value == null ? '—' : `${leaseTerm.value} years`}
          estimate={leaseTerm.estimated}
          info="Assumed length of the head lease to the care or housing provider."
        />
        <Fact
          label="Break year"
          value={
            breakYear.value == null ? 'None' : `Year ${breakYear.value}`
          }
          estimate={breakYear.estimated}
          info="First year a contractual break can be exercised, if the lease has one."
        />
        <Fact
          label="CPI uplift"
          value={formatPercent(cpi.value)}
          estimate={cpi.estimated}
          info="Annual inflation-linked uplift applied to rent across the lease."
        />
        <Fact
          label="FRI"
          value={fri.value == null ? '—' : formatYesNo(fri.value)}
          estimate={fri.estimated}
          info="Whether the lease is full repairing and insuring, so the tenant meets repair and insurance costs."
        />
        <Fact
          label="Vacant-possession value"
          value={formatCurrency(vp.value)}
          estimate={vp.estimated}
          info="Estimated value if the property were sold with vacant possession, not as a leased supported-living asset."
        />
        <Fact
          label="Refurb low"
          value={formatCurrency(refurbLow.value)}
          estimate={refurbLow.estimated}
          info="Low-end refurb and conversion cost to deliver this scheme."
        />
        <Fact
          label="Refurb high"
          value={formatCurrency(refurbHigh.value)}
          estimate={refurbHigh.estimated}
          info="High-end refurb and conversion cost to deliver this scheme."
        />
        <Fact
          label="Compliance lump sum"
          value={formatCurrency(compliance.value)}
          estimate={compliance.estimated}
          info="One-off compliance spend (fire, adaptations, registration) modelled on top of the refurb range."
        />
      </Stack>
    </Stack>
  );
}

function RoomSchedule({ scheme }: { scheme: HmoLayoutScheme }) {
  if (scheme.rooms.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Indicative room schedule</Typography>
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
                room.meetsSpaceStandard === false ? 'warning.main' : 'divider',
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
              <Typography fontWeight={600}>
                {room.label}{' '}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
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
  );
}

export function SchemeOverviewSection({ scheme }: SchemeOverviewSectionProps) {
  const supportedLiving = isSupportedLivingScheme(scheme);
  const extras = scheme.supportedLiving;
  const staffRoom = staffRoomChoice(scheme);
  const planningNote = extras?.planningNote ?? SUPPORTED_LIVING_C2_NOTE;

  return (
    <Stack spacing={2}>
      {/* The section header carries the recommended badge for this scheme. */}
      <Typography>{scheme.summary}</Typography>

      {supportedLiving && extras?.planningNote !== '' ? (
        <Typography variant="body2" color="text.secondary">
          {planningNote}
        </Typography>
      ) : null}

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Letting rooms"
          value={String(scheme.lettingRooms)}
          info="Number of rooms intended for letting under this scheme, after any conversion plan."
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
        {extras ? (
          <>
            <Fact
              label="Rent across the lease"
              value={formatCurrency(extras.outputs.rentAcrossLeaseGbp)}
              info="Total rent collected over the lease after modelled CPI uplifts."
            />
            <Fact
              label="Yield on vacant possession"
              value={formatPercent(extras.outputs.yieldOnVacantPossession)}
              info="Annual rent divided by vacant-possession value, rather than asking price."
            />
            <Fact
              label="Premium over a normal let"
              value={formatCurrency(extras.outputs.premiumOverNormalLetGbp)}
              info="Extra annual income versus a standard AST of the same property."
            />
            <Fact
              label="Provider-failure net cash flow"
              value={formatCurrency(
                extras.outputs.providerFailureNetCashFlowGbp,
              )}
              info="Annual cash flow if the care or housing provider fails and the lease income stops."
            />
          </>
        ) : null}
      </Stack>

      {supportedLiving ? (
        <SupportedLivingInputs inputs={extras?.inputs} scheme={scheme} />
      ) : null}

      {staffRoom ? (
        <Stack spacing={1}>
          <Typography variant="subtitle2">Staff-room choice</Typography>
          <Typography>
            {staffRoom.option}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {staffRoom.reason}
          </Typography>
        </Stack>
      ) : null}

      <RoomSchedule scheme={scheme} />
    </Stack>
  );
}
