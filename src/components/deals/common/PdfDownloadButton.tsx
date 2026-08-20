import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ErrorAlert } from '@/components/common/Feedback';
import { useDealPdfDownload } from '@/hooks/useDealPdfDownload';
import type { TierAccess } from '@/models';

interface PdfDownloadButtonProps {
  dealId: string;
  disabled?: boolean;
  tierAccess?: TierAccess;
}

export function PdfDownloadButton({
  dealId,
  disabled = false,
  tierAccess,
}: PdfDownloadButtonProps) {
  const download = useDealPdfDownload();
  const pdfLocked = tierAccess != null && !tierAccess.pdfExport;

  if (pdfLocked) {
    return (
      <Stack spacing={1} alignItems={{ xs: 'stretch', sm: 'flex-end' }}>
        <Button component={RouterLink} to="/pricing" variant="outlined">
          Upgrade for PDF export
        </Button>
        <Typography variant="caption" color="text.secondary">
          PDF export is included from Starter upward.
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        disabled={disabled || download.isPending}
        onClick={() => download.mutate(dealId)}
      >
        {download.isPending ? 'Preparing PDF…' : 'Download PDF'}
      </Button>
      {download.isError ? <ErrorAlert error={download.error} /> : null}
    </>
  );
}
