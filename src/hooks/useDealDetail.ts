import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { getDeal } from '@/api/deals';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/hooks/queryKeys';
import { AnalysisSocket } from '@/lib/websocket';
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
  const watchingSinceRef = useRef<number | null>(null);

  useEffect(() => {
    watchingSinceRef.current = dealId ? Date.now() : null;
  }, [dealId]);

  const query = useQuery({
    queryKey: queryKeys.deal(dealId ?? ''),
    queryFn: () => getDeal(dealId!),
    enabled: Boolean(user && dealId),
    refetchInterval: (currentQuery) =>
      dealPollInterval(
        currentQuery.state.data?.status,
        watchingSinceRef.current,
        Date.now(),
      ),
  });

  useEffect(() => {
    if (!dealId) {
      return;
    }

    let cancelled = false;
    /**
     * Subscribe for analysis completion and proposed-layout render updates.
     * HTTP polling remains the fallback while status is PROCESSING.
     */
    const socket = new AnalysisSocket((message) => {
      if (message.jobId !== dealId) {
        return;
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.deal(dealId) });
      if (message.type === 'DEAL_UPDATE') {
        void queryClient.invalidateQueries({ queryKey: queryKeys.deals });
      }
    });

    void (async () => {
      const token = await getIdToken();
      if (!token || cancelled) {
        return;
      }
      try {
        await socket.connect(token);
        if (!cancelled) {
          socket.subscribe(dealId);
        }
      } catch {
        // Polling remains the fallback when the socket cannot connect.
      }
    })();

    return () => {
      cancelled = true;
      socket.close();
    };
  }, [dealId, getIdToken, queryClient]);

  return query;
}
