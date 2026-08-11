import { Box } from '@mui/material';
import { useState } from 'react';
import { ImageLightbox } from '@/components/deals/common/ImageLightbox';

interface PropertyImagesProps {
  imageUrls: string[];
}

export function PropertyImages({ imageUrls }: PropertyImagesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            onClick={() => setOpenIndex(index)}
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

      <ImageLightbox
        images={imageUrls}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
        label="Property photo"
      />
    </>
  );
}
