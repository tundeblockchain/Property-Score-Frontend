import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { getDeal } from '@/api/deals';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/hooks/queryKeys';
import { useJobSocket } from '@/hooks/useJobSocket';
import type { DealStatus } from '@/models';

const POLL_INTERVAL_MS = 5000;
/** Stops a forgotten tab polling forever if a job never reaches a result. */
const MAX_POLL_MS = 10 * 60 * 1000;

/**
 * Polling is the fallback for the socket, so it only runs while a deal is
 * still being analysed and gives up once the job has clearly overrun.
 */
export function dealPollInterval(
  status: DealStatus | undefined,
  watchingSince: number | null,
  now: number,
): number | false {
  if (status !== 'PROCESSING') {
    return false;
  }
  if (watchingSince != null && now - watchingSince > MAX_POLL_MS) {
    return false;
  }
  return POLL_INTERVAL_MS;
}

export function useDealDetail(dealId: string | undefined) {
  const { user, getIdToken } = useAuth();
  const queryClient = useQueryClient();
  const watchingSinceRef = useRef<{
    dealId: string | undefined;
    at: number | null;
  }>({ dealId: undefined, at: null });

  if (watchingSinceRef.current.dealId !== dealId) {
    watchingSinceRef.current = {
      dealId,
      at: dealId ? Date.now() : null,
    };
  }

  const query = useQuery({
    queryKey: queryKeys.deal(dealId ?? ''),
    queryFn: () => getDeal(dealId!),
    enabled: Boolean(user && dealId),
    refetchInterval: (currentQuery) =>
      dealPollInterval(
        currentQuery.state.data?.status,
        watchingSinceRef.current.at,
        Date.now(),
      ),
  });

  useJobSocket(dealId, getIdToken, (message) => {
    if (!dealId || message.jobId !== dealId) {
      return;
    }
    void queryClient.invalidateQueries({ queryKey: queryKeys.deal(dealId) });
    if (message.type === 'DEAL_UPDATE') {
      void queryClient.invalidateQueries({ queryKey: queryKeys.deals });
    }
  });

  return query;
}
