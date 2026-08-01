import { Chip, Stack, Typography } from '@mui/material';
import type { TransportEnrichment } from '@/models';

interface TransportPanelProps {
  transport: TransportEnrichment;
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

export function TransportPanel({ transport }: TransportPanelProps) {
  return (
    <Stack spacing={1.5}>
      {transport.stub ? (
        <Chip label="Estimated" size="small" sx={{ alignSelf: 'flex-start' }} />
      ) : null}
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
