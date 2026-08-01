import { Chip, Stack, Typography } from '@mui/material';
import { formatCurrency } from '@/lib/format';
import type { PropertyListingSummary } from '@/models';

interface ListingSummaryProps {
  listing: PropertyListingSummary;
  listingUrl?: string;
}

export function ListingSummary({ listing, listingUrl }: ListingSummaryProps) {
  const details = [
    listing.propertyType,
    listing.bedrooms != null ? `${listing.bedrooms} bed` : null,
    listing.bathrooms != null ? `${listing.bathrooms} bath` : null,
    listing.postcode,
  ].filter(Boolean);

  return (
    <Stack spacing={1.5}>
      <Typography variant="h5" component="h2">
        {listing.address ?? listing.postcode ?? 'Listing'}
      </Typography>
      <Typography variant="h6" color="primary.dark">
        {formatCurrency(listing.price)}
      </Typography>
      {details.length > 0 ? (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {details.map((detail) => (
            <Chip key={String(detail)} label={detail} size="small" />
          ))}
        </Stack>
      ) : null}
      {(listingUrl ?? listing.url) ? (
        <Typography
          component="a"
          href={listingUrl ?? listing.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          color="primary"
        >
          View on Rightmove
        </Typography>
      ) : null}
    </Stack>
  );
}
