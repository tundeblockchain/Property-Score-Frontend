import { Chip, Stack, Typography } from '@mui/material';
import type { SchoolsEnrichment } from '@/models';

interface SchoolsPanelProps {
  schools: SchoolsEnrichment;
}

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

export function SchoolsPanel({ schools }: SchoolsPanelProps) {
  return (
    <Stack spacing={1.5}>
      {schools.stub ? (
        <Chip label="Estimated" size="small" sx={{ alignSelf: 'flex-start' }} />
      ) : null}
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Within 2 miles"
          value={String(schools.schoolCountWithin2Miles)}
        />
        <Fact label="Nearest" value={schools.nearestSchoolName ?? '—'} />
        <Fact
          label="Nearest distance"
          value={
            schools.nearestPrimaryMiles != null
              ? `${schools.nearestPrimaryMiles} mi`
              : '—'
          }
        />
      </Stack>
      {schools.nearbySchools.length > 0 ? (
        <Typography variant="body2" color="primary.main">
          {schools.nearbySchools
            .slice(0, 5)
            .map((school) => `${school.name} (${school.miles} mi)`)
            .join(' · ')}
        </Typography>
      ) : null}
      {schools.notes ? (
        <Typography variant="caption" color="text.secondary">
          {schools.notes}
        </Typography>
      ) : null}
    </Stack>
  );
}
