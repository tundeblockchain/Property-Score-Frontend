import { Box, Chip, Stack, Typography } from '@mui/material';
import { Fact } from '@/components/deals/common/Fact';
import {
  staffRoomOptionLabel,
} from '@/components/deals/hmoPlanner/labels';
import { formatCurrency, formatPercent } from '@/lib/format';
import type {
  HmoEstimatedInput,
  HmoLayoutScheme,
  HmoSupportedLiving,
} from '@/models';

interface SupportedLivingSectionProps {
  scheme: HmoLayoutScheme;
  extras: HmoSupportedLiving;
}

function inputValue<T>(
  field: HmoEstimatedInput<T> | undefined,
  fallback?: T,
): { value: T | undefined; estimate: boolean } {
  if (field) {
    return { value: field.value, estimate: field.isEstimate };
  }
  return { value: fallback, estimate: false };
}

function formatYesNo(value: boolean): string {
  return value ? 'Yes' : 'No';
}

function Assumptions({
  extras,
  scheme,
}: {
  extras: HmoSupportedLiving;
  scheme: HmoLayoutScheme;
}) {
  const { inputs } = extras;
  const rent = inputValue(
    inputs.rentPerRoomWeekly,
    scheme.financials.roomRentWeeklyAssumed,
  );
  const leaseTerm = inputValue(inputs.leaseTermYears);
  const breakYear = inputValue(inputs.breakYear);
  const cpi = inputValue(inputs.cpiUpliftPct);
  const fri = inputValue(inputs.fri);
  const vp = inputValue(inputs.vacantPossessionValueGbp);
  const refurbLow = inputValue(inputs.refurbLowGbp, scheme.estimatedRefurbLowGbp);
  const refurbHigh = inputValue(
    inputs.refurbHighGbp,
    scheme.estimatedRefurbHighGbp,
  );
  const compliance = inputValue(inputs.complianceLumpSumGbp);
  const ensuitePremium = inputValue(inputs.staffEnsuiteRentPremiumWeekly);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Assumptions</Typography>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Rent per room / wk"
          value={formatCurrency(rent.value)}
          estimate={rent.estimate}
          info="Weekly rent per supported-living room used to build the lease income."
        />
        <Fact
          label="Lease term"
          value={leaseTerm.value == null ? '—' : `${leaseTerm.value} years`}
          estimate={leaseTerm.estimate}
          info="Assumed length of the head lease to the care or housing provider."
        />
        <Fact
          label="Break year"
          value={breakYear.value == null ? '—' : `Year ${breakYear.value}`}
          estimate={breakYear.estimate}
          info="First year a contractual break can be exercised, if the lease has one."
        />
        <Fact
          label="CPI uplift"
          value={formatPercent(cpi.value)}
          estimate={cpi.estimate}
          info="Annual inflation-linked uplift applied to rent across the lease."
        />
        <Fact
          label="FRI"
          value={fri.value == null ? '—' : formatYesNo(fri.value)}
          estimate={fri.estimate}
          info="Whether the lease is full repairing and insuring, so the tenant meets repair and insurance costs."
        />
        <Fact
          label="Vacant-possession value"
          value={formatCurrency(vp.value)}
          estimate={vp.estimate}
          info="Estimated value if the property were sold with vacant possession, not as a leased supported-living asset."
        />
        <Fact
          label="Refurb low"
          value={formatCurrency(refurbLow.value)}
          estimate={refurbLow.estimate}
          info="Low-end refurb and conversion cost to deliver this scheme."
        />
        <Fact
          label="Refurb high"
          value={formatCurrency(refurbHigh.value)}
          estimate={refurbHigh.estimate}
          info="High-end refurb and conversion cost to deliver this scheme."
        />
        <Fact
          label="Compliance lump sum"
          value={formatCurrency(compliance.value)}
          estimate={compliance.estimate}
          info="One-off compliance spend (fire, adaptations, registration) modelled on top of the refurb range."
        />
        <Fact
          label="Staff ensuite rent premium / wk"
          value={formatCurrency(ensuitePremium.value)}
          estimate={ensuitePremium.estimate}
          info="Extra weekly rent assumed when the staff room is modelled with an ensuite."
        />
      </Stack>
    </Stack>
  );
}

function LeaseRentTable({ extras }: { extras: HmoSupportedLiving }) {
  const total = extras.leaseRentByYear.reduce(
    (sum, row) => sum + row.rentGbp,
    0,
  );

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Rent across the lease</Typography>
      <Box
        component="table"
        sx={{
          borderCollapse: 'collapse',
          width: '100%',
          maxWidth: 420,
          '& th, & td': {
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 0.75,
            textAlign: 'left',
          },
          '& td:last-of-type, & th:last-of-type': {
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
          },
        }}
      >
        <Typography
          component="caption"
          variant="caption"
          color="text.secondary"
          sx={{ captionSide: 'bottom', display: 'table-caption', textAlign: 'left' }}
        >
          Annual rent after modelled CPI uplifts.
        </Typography>
        <thead>
          <tr>
            <Typography component="th" variant="body2" color="text.secondary">
              Year
            </Typography>
            <Typography component="th" variant="body2" color="text.secondary">
              Rent
            </Typography>
          </tr>
        </thead>
        <tbody>
          {extras.leaseRentByYear.map((row) => (
            <tr key={row.year}>
              <Typography component="td" variant="body2">
                {row.year}
              </Typography>
              <Typography component="td" variant="body2" fontWeight={600}>
                {formatCurrency(row.rentGbp)}
              </Typography>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <Typography component="th" variant="body2" fontWeight={600} scope="row">
              Total
            </Typography>
            <Typography component="td" variant="body2" fontWeight={600}>
              {formatCurrency(total)}
            </Typography>
          </tr>
        </tfoot>
      </Box>
    </Stack>
  );
}

function StaffRoomChoice({ extras }: { extras: HmoSupportedLiving }) {
  const options: Array<{
    key: keyof HmoSupportedLiving['staffRoomOptions'];
    option: typeof extras.staffRoomOption;
  }> = [
    { key: 'withEnsuite', option: 'with_ensuite' },
    { key: 'withoutEnsuite', option: 'without_ensuite' },
  ];

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Staff-room choice</Typography>
      <Typography>
        Chosen: {staffRoomOptionLabel(extras.staffRoomOption)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {extras.staffRoomOptionReason}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
      >
        {options.map(({ key, option }) => {
          const money = extras.staffRoomOptions[key];
          const chosen = extras.staffRoomOption === option;
          return (
            <Stack
              key={option}
              spacing={1}
              sx={{
                flex: 1,
                minWidth: 200,
                borderLeft: 3,
                borderColor: chosen ? 'success.main' : 'divider',
                pl: 1.5,
                py: 0.5,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" useFlexGap>
                <Typography fontWeight={600}>
                  {staffRoomOptionLabel(option)}
                </Typography>
                {chosen ? (
                  <Chip label="Chosen" size="small" color="success" />
                ) : null}
              </Stack>
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Fact
                  label="Net cash flow / yr"
                  value={formatCurrency(money.netCashFlowAnnual)}
                />
                <Fact
                  label="Est. ROI"
                  value={formatPercent(money.estimatedRoi)}
                />
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export function SupportedLivingSection({
  scheme,
  extras,
}: SupportedLivingSectionProps) {
  return (
    <Stack spacing={2}>
      {extras.planningNote ? (
        <Typography variant="body2" color="text.secondary">
          {extras.planningNote}
        </Typography>
      ) : null}

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Yield on vacant possession"
          value={formatPercent(extras.yieldOnVacantPossession)}
          info="Annual rent divided by vacant-possession value, rather than asking price."
        />
        <Fact
          label="Premium over a normal let"
          value={formatCurrency(extras.premiumOverNormalLetAnnualGbp)}
          info="Extra annual income versus a standard AST of the same property."
        />
        <Fact
          label="Provider-failure net cash flow"
          value={formatCurrency(extras.providerFailureNetCashFlowAnnual)}
          info="Annual cash flow if the care or housing provider fails and the lease income stops."
        />
      </Stack>

      <Assumptions extras={extras} scheme={scheme} />
      <LeaseRentTable extras={extras} />
      <StaffRoomChoice extras={extras} />
    </Stack>
  );
}
