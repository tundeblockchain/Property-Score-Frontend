import { Box, Typography } from '@mui/material';
import { looksLikeHtml, sanitizeListingHtml } from '@/lib/sanitizeListingHtml';

interface ListingDescriptionProps {
  description: string;
}

export function ListingDescription({ description }: ListingDescriptionProps) {
  const trimmed = description.trim();
  if (!trimmed) {
    return null;
  }

  if (!looksLikeHtml(trimmed)) {
    return (
      <Typography color="text.primary" whiteSpace="pre-wrap">
        {trimmed}
      </Typography>
    );
  }

  const html = sanitizeListingHtml(trimmed);
  if (!html) {
    return null;
  }

  return (
    <Box
      className="listing-description"
      sx={{
        color: 'text.primary',
        '& p': {
          m: 0,
          mb: 1.5,
          lineHeight: 1.7,
        },
        '& p:last-child': {
          mb: 0,
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          color: 'text.primary',
          fontFamily: '"Plus Jakarta Sans", "Manrope", sans-serif',
          fontWeight: 700,
          lineHeight: 1.35,
          mt: 2,
          mb: 1,
        },
        '& h1': { fontSize: '1.5rem' },
        '& h2': { fontSize: '1.35rem' },
        '& h3': { fontSize: '1.2rem' },
        '& h4, & h5, & h6': { fontSize: '1.05rem' },
        '& h1:first-child, & h2:first-child, & h3:first-child, & h4:first-child, & h5:first-child, & h6:first-child':
          {
            mt: 0,
          },
        '& ul, & ol': {
          m: 0,
          mb: 1.5,
          pl: 2.5,
        },
        '& li': {
          mb: 0.5,
          lineHeight: 1.6,
        },
        '& a': {
          color: 'primary.main',
          fontWeight: 600,
        },
        '& strong, & b': {
          color: 'text.primary',
          fontWeight: 700,
        },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
