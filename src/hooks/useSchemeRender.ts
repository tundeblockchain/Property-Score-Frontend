import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSchemeRender, postSchemeRender } from '@/api/deals';
import { queryKeys } from '@/hooks/queryKeys';
import type { HmoSchemeRendering, RenderDealSchemeResponse } from '@/models';

const PENDING_POLL_MS = 2500;
const READY_REFRESH_BUFFER_MS = 120_000;
const MIN_READY_REFRESH_MS = 60_000;
const DEFAULT_IMAGE_TTL_SECONDS = 900;

export function schemeRenderImageUrls(
  data: RenderDealSchemeResponse | undefined,
): string[] {
  if (data?.imageUrls && data.imageUrls.length > 0) {
    return data.imageUrls;
  }
  return data?.imageUrl ? [data.imageUrl] : [];
}

export function schemeRenderPollInterval(
  data: RenderDealSchemeResponse | undefined,
  dealRendering: HmoSchemeRendering | undefined,
): number | false {
  const status = data?.rendering.status ?? dealRendering?.status;
  if (status === 'pending') {
    return PENDING_POLL_MS;
  }
  if (status === 'ready' && schemeRenderImageUrls(data).length > 0) {
    const expiresMs = (data?.expiresInSeconds ?? DEFAULT_IMAGE_TTL_SECONDS) * 1000;
    return Math.max(expiresMs - READY_REFRESH_BUFFER_MS, MIN_READY_REFRESH_MS);
  }
  return false;
}

export function useSchemeRender(input: {
  dealId: string;
  schemeId: string;
  enabled: boolean;
  rendering: HmoSchemeRendering | undefined;
}) {
  const queryClient = useQueryClient();
  const { dealId, schemeId, enabled, rendering } = input;

  const query = useQuery({
    queryKey: queryKeys.schemeRender(dealId, schemeId),
    queryFn: async () => {
      const result = await getSchemeRender(dealId, schemeId);
      if (result.rendering.status === 'failed') {
        void queryClient.invalidateQueries({ queryKey: queryKeys.billing });
      }
      return result;
    },
    enabled:
      enabled && (rendering?.status === 'pending' || rendering?.status === 'ready'),
    refetchInterval: (currentQuery) =>
      schemeRenderPollInterval(currentQuery.state.data, rendering),
  });

  const generate = useMutation({
    mutationFn: () => postSchemeRender(dealId, schemeId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.schemeRender(dealId, schemeId), data);
      void queryClient.invalidateQueries({ queryKey: queryKeys.deal(dealId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing });
    },
  });

  return { query, generate };
}
