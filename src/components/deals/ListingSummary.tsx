import { Box, Chip, Stack, Typography } from '@mui/material';
import { formatCurrency } from '@/lib/format';
import type { PropertyListingSummary } from '@/models';

interface ListingSummaryProps {
  listing: PropertyListingSummary;
  listingUrl?: string;
  /** Tighter layout for the analysis progress screen. */
  compact?: boolean;
}

export function ListingSummary({
  listing,
  listingUrl,
  compact = false,
}: ListingSummaryProps) {
  const details = [
    listing.propertyType,
    listing.bedrooms != null ? `${listing.bedrooms} bed` : null,
    listing.bathrooms != null ? `${listing.bathrooms} bath` : null,
    listing.postcode,
  ].filter(Boolean);
  const primaryImage = listing.imageUrls?.[0];
  const href = listingUrl ?? listing.url;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ sm: 'flex-start' }}
    >
      {primaryImage ? (
        <Box
          component="img"
          src={primaryImage}
          alt={listing.address ?? 'Property listing'}
          loading="lazy"
          sx={{
            width: { xs: '100%', sm: compact ? 168 : 200 },
            maxWidth: { xs: '100%', sm: compact ? 168 : 200 },
            aspectRatio: '4 / 3',
            objectFit: 'cover',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            bgcolor: 'secondary.main',
          }}
        />
      ) : null}

      <Stack spacing={compact ? 1 : 1.5} sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant={compact ? 'subtitle1' : 'h5'}
          component={compact ? 'p' : 'h2'}
          fontWeight={700}
          color="primary.dark"
        >
          {listing.address ?? listing.postcode ?? 'Listing'}
        </Typography>
        <Typography
          variant={compact ? 'body1' : 'h6'}
          fontWeight={600}
          color="primary.dark"
        >
          {formatCurrency(listing.price)}
        </Typography>
        {details.length > 0 ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {details.map((detail) => (
              <Chip key={String(detail)} label={detail} size="small" />
            ))}
          </Stack>
        ) : null}
        {href ? (
          <Typography
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            color="primary"
          >
            View on Rightmove
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}
