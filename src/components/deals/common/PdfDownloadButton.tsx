import { Button } from '@mui/material';
import { ErrorAlert } from '@/components/common/Feedback';
import { useDealPdfDownload } from '@/hooks/useDealPdfDownload';

interface PdfDownloadButtonProps {
  dealId: string;
  disabled?: boolean;
}

export function PdfDownloadButton({
  dealId,
  disabled = false,
}: PdfDownloadButtonProps) {
  const download = useDealPdfDownload();

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
