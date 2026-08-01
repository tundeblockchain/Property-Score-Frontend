import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  ErrorAlert,
  FailedAnalysisAlert,
  LoadingState,
  PageHeader,
} from '@/components/common/Feedback';
import { ActionPlanList } from '@/components/deals/ActionPlanList';
import { AreaInsightsPanel } from '@/components/deals/AreaInsightsPanel';
import { ComparablesPanel } from '@/components/deals/ComparablesPanel';
import { DealStatusChip } from '@/components/deals/DealStatusChip';
import { EpcPanel } from '@/components/deals/EpcPanel';
import { FinancialModelPanel } from '@/components/deals/FinancialModelPanel';
import { FloorPlans } from '@/components/deals/FloorPlans';
import { ListingDescription } from '@/components/deals/ListingDescription';
import { ListingSummary } from '@/components/deals/ListingSummary';
import { OverallScoreBadge } from '@/components/deals/OverallScoreBadge';
import { PdfDownloadButton } from '@/components/deals/PdfDownloadButton';
import { PropertyImages } from '@/components/deals/PropertyImages';
import { ReportSection } from '@/components/deals/ReportSection';
import { SchoolsPanel } from '@/components/deals/SchoolsPanel';
import { ScoreBreakdownBars } from '@/components/deals/ScoreBreakdownBars';
import { TransportPanel } from '@/components/deals/TransportPanel';
import { useDealDetail } from '@/hooks/useDealDetail';
import { formatDate } from '@/lib/format';

const fullWidth = { gridColumn: '1 / -1' } as const;

export function DealDetailPage() {
  const { dealId } = useParams<{ dealId: string }>();
  const { data, isLoading, isError, error } = useDealDetail(dealId);
  const enrichment = data?.enrichment;

  if (isLoading) {
    return <LoadingState label="Loading deal…" />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  if (!data || !dealId) {
    return <Alert severity="warning">Deal not found.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Deal report"
        subtitle={`Updated ${formatDate(data.updatedAt)}`}
        action={
          data.status === 'COMPLETED' ? (
            <PdfDownloadButton dealId={dealId} />
          ) : undefined
        }
      />

      <Stack direction="row" spacing={1} alignItems="center">
        <DealStatusChip status={data.status} />
      </Stack>

      {data.status === 'FAILED' ? (
        <FailedAnalysisAlert errorMessage={data.errorMessage} />
      ) : null}

      {data.status === 'PROCESSING' ? (
        <Alert severity="info">This analysis is still running.</Alert>
      ) : null}

      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ sm: 'flex-start' }}
        >
          {data.scores ? (
            <OverallScoreBadge score={data.scores.overall} />
          ) : null}
          {data.listing ? (
            <ListingSummary
              listing={data.listing}
              listingUrl={data.listingUrl}
            />
          ) : (
            <Typography color="text.secondary">{data.listingUrl}</Typography>
          )}
        </Stack>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          alignItems: 'start',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
          },
        }}
      >
        {data.listing?.imageUrls && data.listing.imageUrls.length > 0 ? (
          <ReportSection title="Property images" sx={fullWidth}>
            <PropertyImages imageUrls={data.listing.imageUrls} />
          </ReportSection>
        ) : null}

        {data.listing?.floorPlanUrls && data.listing.floorPlanUrls.length > 0 ? (
          <ReportSection title="Floor plans" sx={fullWidth}>
            <FloorPlans floorPlanUrls={data.listing.floorPlanUrls} />
          </ReportSection>
        ) : null}

        {data.listing?.description ? (
          <ReportSection title="Listing description" sx={fullWidth}>
            <ListingDescription description={data.listing.description} />
          </ReportSection>
        ) : null}

        {data.scores ? (
          <ReportSection title="Score breakdown" defaultExpanded>
            <ScoreBreakdownBars scores={data.scores} />
          </ReportSection>
        ) : null}

        {data.financialModel ? (
          <ReportSection title="Financial model" defaultExpanded>
            <FinancialModelPanel model={data.financialModel} />
          </ReportSection>
        ) : null}

        {data.narrative ? (
          <ReportSection title="Narrative" defaultExpanded sx={fullWidth}>
            <Typography color="primary.dark" whiteSpace="pre-wrap">
              {data.narrative}
            </Typography>
          </ReportSection>
        ) : null}

        {enrichment?.epc ? (
          <ReportSection title="EPC">
            <EpcPanel epc={enrichment.epc} />
          </ReportSection>
        ) : null}

        {enrichment?.soldPrices ? (
          <ReportSection title="Sold comparables">
            <ComparablesPanel soldPrices={enrichment.soldPrices} />
          </ReportSection>
        ) : null}

        {enrichment?.transport ? (
          <ReportSection title="Transport">
            <TransportPanel transport={enrichment.transport} />
          </ReportSection>
        ) : null}

        {enrichment?.schools ? (
          <ReportSection title="Schools">
            <SchoolsPanel schools={enrichment.schools} />
          </ReportSection>
        ) : null}

        {enrichment?.broadband ||
        enrichment?.planning ||
        enrichment?.market ||
        enrichment?.crime ||
        enrichment?.demographics ? (
          <ReportSection title="Area insights" sx={fullWidth}>
            <AreaInsightsPanel
              broadband={enrichment.broadband}
              planning={enrichment.planning}
              market={enrichment.market}
              crime={enrichment.crime}
              demographics={enrichment.demographics}
            />
          </ReportSection>
        ) : null}

        {data.actionPlan && data.actionPlan.length > 0 ? (
          <ReportSection title="Action plan" defaultExpanded sx={fullWidth}>
            <ActionPlanList items={data.actionPlan} />
          </ReportSection>
        ) : null}
      </Box>
    </Stack>
  );
}
