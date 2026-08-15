import { Stack, Typography } from '@mui/material';
import { ErrorAlert } from '@/components/common/Feedback';
import { FloorPlans } from '@/components/deals/panels/FloorPlans';
import { schemeRenderImageUrls, useSchemeRender } from '@/hooks/useSchemeRender';
import type { HmoLayoutScheme } from '@/models';
import { proposedFloorPlanRendering } from './schemes';

const DISCLAIMER =
  'Illustrative concept only — not a measured survey or Building Regulations drawing.';

interface ProposedLayoutGalleryProps {
  dealId: string;
  schemes: HmoLayoutScheme[];
}

function ReadyProposedLayout({
  dealId,
  scheme,
}: {
  dealId: string;
  scheme: HmoLayoutScheme;
}) {
  const rendering = proposedFloorPlanRendering(scheme);
  const { query } = useSchemeRender({
    dealId,
    schemeId: scheme.id,
    enabled: rendering?.status === 'ready',
    rendering,
  });

  const imageUrls = schemeRenderImageUrls(query.data);
  const isLoadingImage = imageUrls.length === 0 && (query.isPending || query.isFetching);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{scheme.title}</Typography>
      {isLoadingImage ? (
        <Typography color="text.secondary">Loading proposed layout…</Typography>
      ) : null}
      {query.isError ? <ErrorAlert error={query.error} /> : null}
      {imageUrls.length > 0 ? (
        <FloorPlans floorPlanUrls={imageUrls} label="Proposed layout" />
      ) : null}
    </Stack>
  );
}

export function ProposedLayoutGallery({
  dealId,
  schemes,
}: ProposedLayoutGalleryProps) {
  if (schemes.length === 0) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <Typography color="text.secondary">{DISCLAIMER}</Typography>
      {schemes.map((scheme) => (
        <ReadyProposedLayout
          key={scheme.id}
          dealId={dealId}
          scheme={scheme}
        />
      ))}
    </Stack>
  );
}
