import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataQualityChip } from '@/components/deals/common/DataQualityChip';
import { Fact } from '@/components/deals/common/Fact';
import type { SchoolsEnrichment } from '@/models';

interface SchoolsPanelProps {
  schools: SchoolsEnrichment;
}

type OfstedChipColor = 'success' | 'warning' | 'error' | 'default';

interface OfstedDisplay {
  label: string;
  color: OfstedChipColor;
  variant: 'filled' | 'outlined';
  description: string;
}

function ofstedDisplay(rating: string | undefined): OfstedDisplay {
  const normalized = rating?.trim().toLowerCase() ?? '';

  if (normalized === '1' || normalized.startsWith('outstanding')) {
    return {
      label: 'Outstanding',
      color: 'success',
      variant: 'filled',
      description:
        'Outstanding — Ofsted grade 1 of 4, the highest inspection rating.',
    };
  }
  if (normalized === '2' || normalized.startsWith('good')) {
    return {
      label: 'Good',
      color: 'success',
      variant: 'outlined',
      description: 'Good — Ofsted grade 2 of 4, a strong inspection rating.',
    };
  }
  if (normalized === '3' || normalized.includes('requires improvement')) {
    return {
      label: 'Requires improvement',
      color: 'warning',
      variant: 'filled',
      description:
        'Requires improvement — Ofsted grade 3 of 4, the school needs to improve.',
    };
  }
  if (normalized === '4' || normalized.startsWith('inadequate')) {
    return {
      label: 'Inadequate',
      color: 'error',
      variant: 'filled',
      description:
        'Inadequate — Ofsted grade 4 of 4, the lowest inspection rating.',
    };
  }

  return {
    label: 'No grade',
    color: 'default',
    variant: 'outlined',
    description: 'No published Ofsted overall effectiveness grade.',
  };
}

function OfstedRatingChip({ rating }: { rating?: string }) {
  const display = ofstedDisplay(rating);

  return (
    <Tooltip title={display.description} arrow enterTouchDelay={0}>
      <Chip
        label={display.label}
        size="small"
        color={display.color}
        variant={display.variant}
        tabIndex={0}
        sx={{ cursor: 'help' }}
      />
    </Tooltip>
  );
}

function goodOrOutstandingValue(schools: SchoolsEnrichment): string {
  if (schools.goodOrOutstandingWithin2Miles == null) {
    return '—';
  }
  return `${schools.goodOrOutstandingWithin2Miles} of ${schools.schoolCountWithin2Miles}`;
}

export function SchoolsPanel({ schools }: SchoolsPanelProps) {
  const nearby = schools.nearbySchools;

  return (
    <Stack spacing={2}>
      {schools.stub ? <DataQualityChip quality="estimated" /> : null}
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Within 2 miles"
          value={String(schools.schoolCountWithin2Miles)}
        />
        <Fact
          label="Good or Outstanding"
          value={goodOrOutstandingValue(schools)}
          info="Schools within 2 miles rated Good (grade 2) or Outstanding (grade 1) at their latest Ofsted inspection. Grades run from 1 Outstanding to 4 Inadequate."
        />
        <Fact label="Nearest" value={schools.nearestSchoolName ?? '—'} />
        <Fact
          label="Nearest primary"
          value={
            schools.nearestPrimaryMiles != null
              ? `${schools.nearestPrimaryMiles} mi`
              : '—'
          }
        />
      </Stack>
      {nearby.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                School
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: 'text.secondary', fontWeight: 600 }}
              >
                Distance
              </TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Phase
              </TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Ofsted
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nearby.map((school, index) => (
              <TableRow key={`${school.name}-${school.miles}-${index}`}>
                <TableCell>{school.name}</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {school.miles} mi
                </TableCell>
                <TableCell>{school.phase ?? '—'}</TableCell>
                <TableCell>
                  <OfstedRatingChip rating={school.ofstedRating} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
      {schools.notes ? (
        <Typography variant="caption" color="text.secondary">
          {schools.notes}
        </Typography>
      ) : null}
    </Stack>
  );
}
