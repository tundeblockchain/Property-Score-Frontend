import { Alert, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  ErrorAlert,
  FailedAnalysisAlert,
  LoadingState,
} from '@/components/common/Feedback';
import { PdfDownloadButton } from '@/components/deals/common/PdfDownloadButton';
import { DealHeroCard } from '@/components/deals/report/DealHeroCard';
import { DealReport } from '@/components/deals/report/DealReport';
import { DealReportHeader } from '@/components/deals/report/DealReportHeader';
import { useDealDetail } from '@/hooks/useDealDetail';

export function DealDetailPage() {
  const { dealId } = useParams<{ dealId: string }>();
  const { data, isLoading, isError, error } = useDealDetail(dealId);

  if (isLoading) {
    return <LoadingState label="Loading property…" />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  if (!data || !dealId) {
    return <Alert severity="warning">Property not found.</Alert>;
  }

  const headerAddress =
    data.listing?.address ?? data.listing?.postcode ?? 'Property report';

  return (
    <Stack spacing={3}>
      <DealReportHeader
        address={headerAddress}
        status={data.status}
        updatedAt={data.updatedAt}
        action={
          <PdfDownloadButton
            dealId={dealId}
            disabled={data.status !== 'COMPLETED'}
          />
        }
      />

      {data.status === 'FAILED' ? (
        <FailedAnalysisAlert errorMessage={data.errorMessage} />
      ) : null}

      {data.status === 'PROCESSING' ? (
        <Alert severity="info">This analysis is still running.</Alert>
      ) : null}

      <DealHeroCard
        listing={data.listing}
        listingUrl={data.listingUrl}
        scores={data.scores}
        financialModel={data.financialModel}
        hmoPlanner={data.hmoPlanner}
      />

      <DealReport deal={data} />
    </Stack>
  );
}
