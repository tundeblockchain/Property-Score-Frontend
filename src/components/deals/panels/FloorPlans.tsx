import { Box, Dialog } from '@mui/material';
import { useState } from 'react';

interface FloorPlansProps {
  floorPlanUrls: string[];
}

export function FloorPlans({ floorPlanUrls }: FloorPlansProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  if (floorPlanUrls.length === 0) {
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
            sm: floorPlanUrls.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          },
        }}
      >
        {floorPlanUrls.map((url, index) => (
          <Box
            key={url}
            component="button"
            type="button"
            onClick={() => setSelectedUrl(url)}
            aria-label={`View floor plan ${index + 1} of ${floorPlanUrls.length}`}
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
              bgcolor: 'background.default',
              '&:focus-visible': {
                outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <Box
              component="img"
              src={url}
              alt={`Floor plan ${index + 1}`}
              loading="lazy"
              sx={{
                display: 'block',
                width: '100%',
                height: 'auto',
                maxHeight: 360,
                objectFit: 'contain',
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
        aria-label="Floor plan preview"
      >
        {selectedUrl ? (
          <Box
            component="img"
            src={selectedUrl}
            alt="Floor plan enlarged"
            sx={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
              bgcolor: 'background.paper',
            }}
          />
        ) : null}
      </Dialog>
    </>
  );
}
