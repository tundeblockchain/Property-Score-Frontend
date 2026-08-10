import { Stack, Typography } from '@mui/material';
import { DataQualityChip } from '@/components/deals/common/DataQualityChip';
import { Fact } from '@/components/deals/common/Fact';
import type { TransportEnrichment } from '@/models';

interface TransportPanelProps {
  transport: TransportEnrichment;
}

export function TransportPanel({ transport }: TransportPanelProps) {
  return (
    <Stack spacing={1.5}>
      {transport.stub ? <DataQualityChip quality="estimated" /> : null}
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Nearest station"
          value={transport.nearestStationName ?? '—'}
        />
        <Fact
          label="Walk time"
          value={
            transport.nearestStationMinutes != null
              ? `${transport.nearestStationMinutes} min`
              : '—'
          }
        />
        <Fact
          label="Distance"
          value={
            transport.nearestStationMeters != null
              ? `${transport.nearestStationMeters} m`
              : '—'
          }
        />
        <Fact
          label="Bus stops within 500m"
          value={String(transport.busStopCountWithin500m)}
        />
      </Stack>
      {transport.notes ? (
        <Typography variant="caption" color="text.secondary">
          {transport.notes}
        </Typography>
      ) : null}
    </Stack>
  );
}
