import { Chip, Stack, Typography } from '@mui/material';
import type { HmoLicensingPath } from '@/models';
import { Fact } from './Fact';
import { NoteList } from './NoteList';
import { licensingChipColor, licensingStatusLabel } from './labels';

interface LicensingPathSectionProps {
  licensing: HmoLicensingPath;
}

export function LicensingPathSection({ licensing }: LicensingPathSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Chip
          label={`Use class ${licensing.useClass}`}
          size="small"
          color="primary"
        />
        <Chip
          label={`${licensing.confidence} confidence`}
          size="small"
          variant="outlined"
        />
      </Stack>

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Occupancy band"
          value={licensing.occupancyBand.replaceAll('_', ' ')}
        />
        <Fact
          label="Est. occupants"
          value={String(licensing.estimatedOccupants)}
        />
        <Stack spacing={0.5} sx={{ minWidth: 160 }}>
          <Typography variant="caption" color="primary.main">
            Planning
          </Typography>
          <Chip
            size="small"
            color={licensingChipColor(licensing.planningPermission.status)}
            label={licensingStatusLabel(licensing.planningPermission.status)}
          />
        </Stack>
        <Stack spacing={0.5} sx={{ minWidth: 160 }}>
          <Typography variant="caption" color="primary.main">
            Mandatory licence
          </Typography>
          <Chip
            size="small"
            color={licensingChipColor(licensing.mandatoryLicence.status)}
            label={licensingStatusLabel(licensing.mandatoryLicence.status)}
          />
        </Stack>
        <Stack spacing={0.5} sx={{ minWidth: 160 }}>
          <Typography variant="caption" color="primary.main">
            Additional / selective
          </Typography>
          <Chip
            size="small"
            color={licensingChipColor(licensing.additionalLicence.status)}
            label={licensingStatusLabel(licensing.additionalLicence.status)}
          />
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {licensing.planningPermission.reason}
      </Typography>
      <NoteList title="Licensing actions" items={licensing.actionItems} />
      <Typography variant="caption" color="text.secondary">
        {licensing.disclaimer}
      </Typography>
    </Stack>
  );
}
