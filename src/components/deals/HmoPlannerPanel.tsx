import {
  Box,
  Chip,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { HmoLayoutScheme, HmoPlannerResult, HmoUseCase } from '@/models';

interface HmoPlannerPanelProps {
  planner: HmoPlannerResult;
}

const USE_CASE_ORDER: HmoUseCase[] = ['students', 'workers', 'social_care'];

const USE_CASE_TAB: Record<HmoUseCase, string> = {
  students: 'Students',
  workers: 'Workers',
  social_care: 'Social care',
};

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 140 }}>
      <Typography variant="caption" color="primary.main">
        {label}
      </Typography>
      <Typography fontWeight={600} color="primary.dark">
        {value}
      </Typography>
    </Stack>
  );
}

function SchemeBody({ scheme }: { scheme: HmoLayoutScheme }) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="subtitle1" color="primary.dark" fontWeight={700}>
          {scheme.title}
        </Typography>
        {scheme.recommended ? (
          <Chip label="Recommended" color="primary" size="small" />
        ) : null}
      </Stack>

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
                borderColor: 'primary.main',
                pl: 1.5,
                py: 0.5,
              }}
            >
              <Typography fontWeight={600} color="primary.dark">
                {room.label}{' '}
                <Typography component="span" variant="body2" color="primary.main">
                  ({room.type}
                  {room.estimatedAreaSqM != null
                    ? ` · ~${room.estimatedAreaSqM} m²`
                    : ''}
                  )
                </Typography>
              </Typography>
              {room.notes ? (
                <Typography variant="caption" color="text.secondary">
                  {room.notes}
                </Typography>
              ) : null}
            </Box>
          ))}
        </Box>
      </Stack>

      <NoteList title="Amenities" items={scheme.amenities} />
      <NoteList title="Layout notes" items={scheme.layoutNotes} />
      <NoteList title="Compliance checks" items={scheme.complianceNotes} />
    </Stack>
  );
}

function NoteList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Stack spacing={0.75}>
      <Typography variant="subtitle2" color="primary.dark">
        {title}
      </Typography>
      <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.5 }}>
        {items.map((item) => (
          <Typography
            key={item}
            component="li"
            variant="body2"
            color="primary.dark"
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}

export function HmoPlannerPanel({ planner }: HmoPlannerPanelProps) {
  const schemesByUseCase = new Map(
    planner.schemes.map((scheme) => [scheme.useCase, scheme]),
  );
  const available = USE_CASE_ORDER.filter((useCase) =>
    schemesByUseCase.has(useCase),
  );
  const recommendedUseCase =
    planner.schemes.find((scheme) => scheme.recommended)?.useCase ??
    available[0];
  const [selected, setSelected] = useState<HmoUseCase>(
    recommendedUseCase ?? 'students',
  );
  const active = schemesByUseCase.get(selected) ?? planner.schemes[0];

  if (!active) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="As listed"
          value={`${planner.asListedBedrooms} beds / ${planner.asListedBathrooms} baths`}
        />
        <Fact
          label="Floor plans on listing"
          value={String(planner.floorPlanCount)}
        />
        <Fact label="Layout source" value="Listed beds (indicative)" />
      </Stack>

      <Tabs
        value={selected}
        onChange={(_, value: HmoUseCase) => setSelected(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        aria-label="HMO use case"
      >
        {available.map((useCase) => {
          const scheme = schemesByUseCase.get(useCase);
          return (
            <Tab
              key={useCase}
              value={useCase}
              label={
                scheme?.recommended
                  ? `${USE_CASE_TAB[useCase]} · best fit`
                  : USE_CASE_TAB[useCase]
              }
            />
          );
        })}
      </Tabs>

      <SchemeBody scheme={active} />

      <Typography variant="caption" color="text.secondary">
        {planner.disclaimer}
      </Typography>
    </Stack>
  );
}
