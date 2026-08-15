import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { useEffect } from 'react';

interface ImageLightboxProps {
  images: readonly string[];
  /** Index of the open image, or null when closed. */
  openIndex: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** Used in accessible names, e.g. "Property photo" or "Floor plan". */
  label: string;
  imageSx?: SxProps<Theme>;
}

export function ImageLightbox({
  images,
  openIndex,
  onClose,
  onIndexChange,
  label,
  imageSx,
}: ImageLightboxProps) {
  const isOpen = openIndex != null && images.length > 0;
  const index = openIndex ?? 0;
  const url = images[index];
  const count = images.length;
  const canNavigate = count > 1;

  useEffect(() => {
    if (!isOpen || !canNavigate) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onIndexChange((index - 1 + count) % count);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onIndexChange((index + 1) % count);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canNavigate, count, index, isOpen, onIndexChange]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          // Without a DialogTitle, MUI's default aria-labelledby points nowhere.
          'aria-labelledby': undefined,
          'aria-label': `${label} preview`,
          sx: {
            bgcolor: 'secondary.main',
            position: 'relative',
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Typography
          variant="body2"
          component="span"
          aria-live="polite"
          sx={{
            color: 'common.white',
            bgcolor: 'rgba(15, 23, 42, 0.72)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {index + 1} / {count}
        </Typography>
        <IconButton
          aria-label="Close preview"
          onClick={onClose}
          size="small"
          sx={{
            color: 'common.white',
            bgcolor: 'rgba(15, 23, 42, 0.72)',
            '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.9)' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {canNavigate ? (
        <>
          <IconButton
            aria-label={`Previous ${label.toLowerCase()}`}
            onClick={() => onIndexChange((index - 1 + count) % count)}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              color: 'common.white',
              bgcolor: 'rgba(15, 23, 42, 0.72)',
              '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.9)' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            aria-label={`Next ${label.toLowerCase()}`}
            onClick={() => onIndexChange((index + 1) % count)}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              color: 'common.white',
              bgcolor: 'rgba(15, 23, 42, 0.72)',
              '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.9)' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      ) : null}

      {url ? (
        <Box
          component="img"
          src={url}
          alt={`${label} ${index + 1} of ${count}`}
          referrerPolicy="no-referrer"
          sx={[
            {
              display: 'block',
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
              bgcolor: 'secondary.main',
            },
            ...(Array.isArray(imageSx) ? imageSx : imageSx ? [imageSx] : []),
          ]}
        />
      ) : null}
    </Dialog>
  );
}
