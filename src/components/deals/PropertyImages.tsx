import { Box, Dialog } from '@mui/material';
import { useState } from 'react';

interface PropertyImagesProps {
  imageUrls: string[];
}

export function PropertyImages({ imageUrls }: PropertyImagesProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: imageUrls.length === 1 ? '1fr' : 'repeat(2, 1fr)',
            md: imageUrls.length === 1 ? '1fr' : 'repeat(3, 1fr)',
          },
        }}
      >
        {imageUrls.map((url, index) => (
          <Box
            key={url}
            component="button"
            type="button"
            onClick={() => setSelectedUrl(url)}
            aria-label={`View property image ${index + 1} of ${imageUrls.length}`}
            sx={{
              display: 'block',
              width: '100%',
              p: 0,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'none',
              lineHeight: 0,
              aspectRatio: '4 / 3',
              '&:focus-visible': {
                outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <Box
              component="img"
              src={url}
              alt={`Property photo ${index + 1}`}
              loading="lazy"
              sx={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
              }}
            />
          </Box>
        ))}
      </Box>

      <Dialog
        open={selectedUrl != null}
        onClose={() => setSelectedUrl(null)}
        maxWidth="lg"
        fullWidth
        aria-label="Property image preview"
      >
        {selectedUrl ? (
          <Box
            component="img"
            src={selectedUrl}
            alt="Property photo enlarged"
            sx={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
              bgcolor: 'secondary.main',
            }}
          />
        ) : null}
      </Dialog>
    </>
  );
}
