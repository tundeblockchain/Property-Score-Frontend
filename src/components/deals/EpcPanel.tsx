import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { formatDateOnly } from '@/lib/format';
import type { EpcEnrichment } from '@/models';

interface EpcPanelProps {
  epc: EpcEnrichment;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 120 }}>
      <Typography variant="caption" color="primary.main">
        {label}
      </Typography>
      <Typography fontWeight={600} color="primary.dark">
        {value}
      </Typography>
    </Stack>
  );
}

export function EpcPanel({ epc }: EpcPanelProps) {
  const history = epc.history ?? [];

  return (
    <Stack spacing={2}>
      {epc.stub ? (
        <Chip label="Estimated" size="small" sx={{ alignSelf: 'flex-start' }} />
      ) : null}

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact label="Current rating" value={epc.currentRating ?? '—'} />
        <Fact label="Potential rating" value={epc.potentialRating ?? '—'} />
        <Fact
          label="Current score"
          value={epc.currentScore != null ? String(epc.currentScore) : '—'}
        />
        <Fact
          label="Potential score"
          value={epc.potentialScore != null ? String(epc.potentialScore) : '—'}
        />
        <Fact label="Lodged" value={formatDateOnly(epc.lodgementDate)} />
        <Fact label="Matches nearby" value={String(epc.matchedCount)} />
      </Stack>

      {epc.address ? (
        <Typography variant="body2" color="text.secondary">
          Matched address: {epc.address}
        </Typography>
      ) : null}

      {history.length > 0 ? (
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="primary.dark">
            Nearby certificate history
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Address
                </TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Rating
                </TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Lodged
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((entry, index) => (
                <TableRow
                  key={
                    entry.certificateNumber ??
                    `${entry.address ?? 'epc'}-${entry.lodgementDate ?? index}`
                  }
                >
                  <TableCell sx={{ color: 'primary.dark' }}>
                    {entry.address ?? '—'}
                  </TableCell>
                  <TableCell sx={{ color: 'primary.dark' }}>
                    {entry.currentRating ?? '—'}
                  </TableCell>
                  <TableCell sx={{ color: 'primary.dark' }}>
                    {formatDateOnly(entry.lodgementDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      ) : null}

      {epc.notes ? (
        <Typography variant="caption" color="text.secondary">
          {epc.notes}
        </Typography>
      ) : null}
    </Stack>
  );
}
