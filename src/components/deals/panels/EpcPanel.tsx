import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DataQualityChip } from '@/components/deals/common/DataQualityChip';
import { Fact } from '@/components/deals/common/Fact';
import { formatDateOnly } from '@/lib/format';
import type { EpcEnrichment } from '@/models';

interface EpcPanelProps {
  epc: EpcEnrichment;
}

/** UK EPC band colours tuned for readable text on a light background. */
function epcRatingColor(rating: string | undefined): string {
  const band = rating?.trim().charAt(0).toUpperCase();
  switch (band) {
    case 'A':
      return '#15803D';
    case 'B':
      return '#16A34A';
    case 'C':
      return '#65A30D';
    case 'D':
      return '#CA8A04';
    case 'E':
      return '#EA580C';
    case 'F':
      return '#C2410C';
    case 'G':
      return '#B91C1C';
    default:
      return 'inherit';
  }
}

export function EpcPanel({ epc }: EpcPanelProps) {
  const history = epc.history ?? [];
  const currentRating = epc.currentRating ?? '—';
  const potentialRating = epc.potentialRating ?? '—';

  return (
    <Stack spacing={2}>
      {epc.stub ? <DataQualityChip quality="estimated" /> : null}

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Current rating"
          value={currentRating}
          valueColor={epcRatingColor(epc.currentRating)}
          emphasis="strong"
        />
        <Fact
          label="Potential rating"
          value={potentialRating}
          valueColor={epcRatingColor(epc.potentialRating)}
          emphasis="strong"
        />
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
          <Typography variant="subtitle2">Nearby certificate history</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Address
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Rating
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
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
                  <TableCell>{entry.address ?? '—'}</TableCell>
                  <TableCell
                    sx={{
                      color: epcRatingColor(entry.currentRating),
                      fontWeight: 700,
                      fontSize: '1.125rem',
                    }}
                  >
                    {entry.currentRating ?? '—'}
                  </TableCell>
                  <TableCell>{formatDateOnly(entry.lodgementDate)}</TableCell>
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
