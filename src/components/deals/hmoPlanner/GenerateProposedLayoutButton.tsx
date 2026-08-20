import { Alert, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ErrorAlert } from '@/components/common/Feedback';
import { ImageLightbox } from '@/components/deals/common/ImageLightbox';
import { useBilling } from '@/hooks/useBilling';
import { schemeRenderImageUrls, useSchemeRender } from '@/hooks/useSchemeRender';
import { PROPOSED_LAYOUT_CREDIT_COST } from '@/lib/plans';
import { ApiError, getUserFacingErrorMessage } from '@/lib/errors';
import type { DealDetail, HmoSchemeRendering } from '@/models';
import { hmoRenderSkipReasonLabel } from './labels';
import { proposedFloorPlanRendering, schemeForProposedLayout } from './schemes';

const FAILED_FALLBACK =
  'The proposed layout could not be generated. Please try again.';

interface GenerateProposedLayoutButtonProps {
  deal: DealDetail;
}

function canRetry(rendering: HmoSchemeRendering | undefined): boolean {
  if (!rendering) {
    return true;
  }
  if (rendering.status === 'failed') {
    return true;
  }
  return rendering.status === 'skipped' && rendering.skipReason === 'no_api_key';
}

export function GenerateProposedLayoutButton({
  deal,
}: GenerateProposedLayoutButtonProps) {
  const billing = useBilling();
  const scheme =
    deal.status === 'COMPLETED' && deal.hmoPlanner
      ? schemeForProposedLayout(deal.hmoPlanner)
      : undefined;
  const rendering = scheme ? proposedFloorPlanRendering(scheme) : undefined;
  const outOfCredits =
    billing.data?.creditsRemaining !== undefined &&
    billing.data.creditsRemaining <= 0;

  const { query, generate } = useSchemeRender({
    dealId: deal.dealId,
    schemeId: scheme?.id ?? '',
    enabled: Boolean(scheme),
    rendering,
  });
  const layoutCreditCost = PROPOSED_LAYOUT_CREDIT_COST;

  const liveRendering =
    query.data?.rendering ?? generate.data?.rendering ?? rendering;
  const photos = schemeRenderImageUrls(query.data ?? generate.data);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isPending =
    generate.isPending || liveRendering?.status === 'pending';
  const skipReason =
    liveRendering?.status === 'skipped' ? liveRendering.skipReason : undefined;
  const failedMessage =
    liveRendering?.status === 'failed'
      ? liveRendering.errorMessage ?? FAILED_FALLBACK
      : undefined;

  if (!scheme) {
    return null;
  }

  if (liveRendering?.status === 'ready') {
    return (
      <>
        <Button
          variant="outlined"
          disabled={photos.length === 0}
          onClick={() => setOpenIndex(0)}
        >
          View proposed layout photos
        </Button>
        <ImageLightbox
          images={photos}
          openIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
          label="Proposed layout"
          imageSx={{ bgcolor: 'background.paper' }}
        />
      </>
    );
  }

  const showGenerate = !isPending && canRetry(liveRendering);
  const showUpgrade =
    generate.error instanceof ApiError && generate.error.isInsufficientCredits;

  return (
    <Stack spacing={1} sx={{ minWidth: { sm: 220 } }}>
      {showGenerate ? (
        <>
          <Button
            variant="contained"
            disabled={generate.isPending || outOfCredits}
            onClick={() => generate.mutate()}
          >
            {liveRendering ? 'Try again' : 'Generate proposed layout'}
          </Button>
          <Typography variant="caption" color="text.secondary">
            Uses 1 credit.
          </Typography>
        </>
      ) : null}

      {outOfCredits && showGenerate ? (
        <Alert severity="warning">
          You are out of credits.{' '}
          <Button component={RouterLink} to="/billing" size="small">
            Upgrade or buy credits
          </Button>
        </Alert>
      ) : null}

      {showUpgrade ? (
        <Alert severity="warning">
          {getUserFacingErrorMessage(generate.error)}{' '}
          <Button component={RouterLink} to="/billing" size="small">
            Go to billing
          </Button>
        </Alert>
      ) : null}

      {isPending ? (
        <Stack spacing={1}>
          <Button variant="contained" disabled>
            Generating layout…
          </Button>
          <LinearProgress aria-label="Generating proposed layout" />
        </Stack>
      ) : null}

      {skipReason ? (
        <Alert severity="info">{hmoRenderSkipReasonLabel(skipReason)}</Alert>
      ) : null}

      {failedMessage ? <Alert severity="error">{failedMessage}</Alert> : null}

      {generate.isError && !showUpgrade ? (
        <ErrorAlert error={generate.error} />
      ) : null}
    </Stack>
  );
}
