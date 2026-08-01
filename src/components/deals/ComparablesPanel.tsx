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
import { formatCurrency, formatDateOnly } from '@/lib/format';
import type { SoldPricesEnrichment } from '@/models';

interface ComparablesPanelProps {
  soldPrices: SoldPricesEnrichment;
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

export function ComparablesPanel({ soldPrices }: ComparablesPanelProps) {
  const comparables = soldPrices.comparables ?? [];

  return (
    <Stack spacing={2}>
      {soldPrices.stub ? (
        <Chip
          label="Limited data"
          size="small"
          sx={{ alignSelf: 'flex-start' }}
        />
      ) : null}

      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Fact
          label="Average sold"
          value={formatCurrency(soldPrices.averageSoldPrice12m)}
        />
        <Fact
          label="Median sold"
          value={formatCurrency(soldPrices.medianSoldPrice)}
        />
        <Fact label="Sales found" value={String(soldPrices.comparableCount)} />
        <Fact
          label="Latest sale"
          value={formatDateOnly(soldPrices.latestSaleDate)}
        />
      </Stack>

      {comparables.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                Address
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                Price
              </TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparables.map((sale, index) => (
              <TableRow
                key={`${sale.address ?? 'sale'}-${sale.transactionDate ?? index}-${sale.pricePaid ?? 0}`}
              >
                <TableCell sx={{ color: 'primary.dark' }}>
                  {sale.address ?? soldPrices.postcode}
                </TableCell>
                <TableCell align="right" sx={{ color: 'primary.dark' }}>
                  {formatCurrency(sale.pricePaid)}
                </TableCell>
                <TableCell sx={{ color: 'primary.dark' }}>
                  {formatDateOnly(sale.transactionDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography color="text.secondary">
          No individual sales were returned for this postcode.
        </Typography>
      )}

      {soldPrices.notes ? (
        <Typography variant="caption" color="text.secondary">
          {soldPrices.notes}
        </Typography>
      ) : null}
    </Stack>
  );
}
