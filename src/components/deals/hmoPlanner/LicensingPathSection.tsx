import { Chip, Link, Stack, Typography } from '@mui/material';
import type { HmoLicensingPath } from '@/models';
import { Fact } from '@/components/deals/common/Fact';
import { NoteList } from './NoteList';
import { licensingChipColor, licensingStatusLabel } from './labels';

interface LicensingPathSectionProps {
  licensing: HmoLicensingPath;
}

export function LicensingPathSection({ licensing }: LicensingPathSectionProps) {
  const match = licensing.localAuthorityMatch;

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
        {match ? (
          <Chip
            label={`Register: ${match.adminDistrict}`}
            size="small"
            variant="outlined"
          />
        ) : null}
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
            Additional HMO
          </Typography>
          <Chip
            size="small"
            color={licensingChipColor(licensing.additionalLicence.status)}
            label={licensingStatusLabel(licensing.additionalLicence.status)}
          />
        </Stack>
        {licensing.selectiveLicence ? (
          <Stack spacing={0.5} sx={{ minWidth: 160 }}>
            <Typography variant="caption" color="primary.main">
              Selective
            </Typography>
            <Chip
              size="small"
              color={licensingChipColor(licensing.selectiveLicence.status)}
              label={licensingStatusLabel(licensing.selectiveLicence.status)}
            />
          </Stack>
        ) : null}
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {licensing.planningPermission.reason}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {licensing.additionalLicence.reason}
      </Typography>
      {licensing.selectiveLicence ? (
        <Typography variant="body2" color="text.secondary">
          {licensing.selectiveLicence.reason}
        </Typography>
      ) : null}

      {match?.notes ? (
        <Typography variant="body2" color="primary.dark">
          Register note ({match.asOf}): {match.notes}
        </Typography>
      ) : null}
      {match?.sourceUrl ? (
        <Link href={match.sourceUrl} target="_blank" rel="noopener noreferrer">
          Local authority licensing source
        </Link>
      ) : null}

      <NoteList title="Licensing actions" items={licensing.actionItems} />
      <Typography variant="caption" color="text.secondary">
        {licensing.disclaimer}
      </Typography>
    </Stack>
  );
}
