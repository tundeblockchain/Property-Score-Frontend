import { Alert, Button, LinearProgress, Stack } from '@mui/material';
import { useState } from 'react';
import { ErrorAlert } from '@/components/common/Feedback';
import { ImageLightbox } from '@/components/deals/common/ImageLightbox';
import { schemeRenderImageUrls, useSchemeRender } from '@/hooks/useSchemeRender';
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
  const scheme =
    deal.status === 'COMPLETED' && deal.hmoPlanner
      ? schemeForProposedLayout(deal.hmoPlanner)
      : undefined;
  const rendering = scheme ? proposedFloorPlanRendering(scheme) : undefined;

  const { query, generate } = useSchemeRender({
    dealId: deal.dealId,
    schemeId: scheme?.id ?? '',
    enabled: Boolean(scheme),
    rendering,
  });

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

  return (
    <Stack spacing={1} sx={{ minWidth: { sm: 220 } }}>
      {showGenerate ? (
        <Button
          variant="contained"
          disabled={generate.isPending}
          onClick={() => generate.mutate()}
        >
          {liveRendering ? 'Try again' : 'Generate proposed layout'}
        </Button>
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

      {generate.isError ? <ErrorAlert error={generate.error} /> : null}
    </Stack>
  );
}
