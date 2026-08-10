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

function Fact({
  label,
  value,
  valueColor,
  emphasize,
}: {
  label: string;
  value: string;
  valueColor?: string;
  emphasize?: boolean;
}) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 120 }}>
      <Typography variant="caption" color="primary.main">
        {label}
      </Typography>
      <Typography
        fontWeight={emphasize ? 800 : 600}
        fontSize={emphasize ? '1.5rem' : undefined}
        lineHeight={emphasize ? 1.2 : undefined}
        color={valueColor ? undefined : 'info.dark'}
        sx={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export function EpcPanel({ epc }: EpcPanelProps) {
  const history = epc.history ?? [];
  const currentRating = epc.currentRating ?? '—';
  const potentialRating = epc.potentialRating ?? '—';

  return (
    <Stack spacing={2}>
      {epc.stub ? (
        <Chip label="Estimated" size="small" sx={{ alignSelf: 'flex-start' }} />
      ) : null}

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Current rating"
          value={currentRating}
          valueColor={epcRatingColor(epc.currentRating)}
          emphasize
        />
        <Fact
          label="Potential rating"
          value={potentialRating}
          valueColor={epcRatingColor(epc.potentialRating)}
          emphasize
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
                  <TableCell
                    sx={{
                      color: epcRatingColor(entry.currentRating),
                      fontWeight: 800,
                      fontSize: '1.125rem',
                    }}
                  >
                    {entry.currentRating ?? '—'}
                  </TableCell>
                  <TableCell sx={{ color: 'info.dark' }}>
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
