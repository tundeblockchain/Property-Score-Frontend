import { Stack, Typography } from '@mui/material';
import { DataQualityChip } from '@/components/deals/common/DataQualityChip';
import { Fact } from '@/components/deals/common/Fact';
import type { NearbySchool, SchoolsEnrichment } from '@/models';

interface SchoolsPanelProps {
  schools: SchoolsEnrichment;
}

function formatNearbySchool(school: NearbySchool): string {
  const details = [
    `${school.miles} mi`,
    school.phase,
    school.ofstedRating,
  ].filter((part): part is string => Boolean(part));
  return `${school.name} (${details.join(', ')})`;
}

export function SchoolsPanel({ schools }: SchoolsPanelProps) {
  return (
    <Stack spacing={1.5}>
      {schools.stub ? <DataQualityChip quality="estimated" /> : null}
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Within 2 miles"
          value={String(schools.schoolCountWithin2Miles)}
        />
        <Fact
          label="Good or Outstanding"
          value={
            schools.goodOrOutstandingWithin2Miles != null
              ? String(schools.goodOrOutstandingWithin2Miles)
              : '—'
          }
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
      {schools.nearbySchools.length > 0 ? (
        <Typography variant="body2" color="text.secondary">
          {schools.nearbySchools.slice(0, 5).map(formatNearbySchool).join(' · ')}
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
