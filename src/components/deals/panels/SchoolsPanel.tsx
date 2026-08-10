import { Stack, Typography } from '@mui/material';
import { DataQualityChip } from '@/components/deals/common/DataQualityChip';
import { Fact } from '@/components/deals/common/Fact';
import type { SchoolsEnrichment } from '@/models';

interface SchoolsPanelProps {
  schools: SchoolsEnrichment;
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
        <Typography variant="body2" color="text.secondary">
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
