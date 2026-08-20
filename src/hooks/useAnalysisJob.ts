import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAnalysisStatus, startAnalysis } from '@/api/analyse';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/hooks/queryKeys';
import { AnalysisSocket } from '@/lib/websocket';
import {
  isValidRightmoveUrl,
  normalizeRightmoveUrl,
} from '@/lib/rightmoveUrl';
import type { AnalyseStatusResponse, JobSocketMessage } from '@/models';

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_MS = 5 * 60 * 1000;

export function useStartAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rightmoveUrl: string) => {
      if (!isValidRightmoveUrl(rightmoveUrl)) {
        throw new Error(
          'Enter a valid Rightmove property URL (e.g. https://www.rightmove.co.uk/properties/123).',
        );
      }
      return startAnalysis({
        rightmove_url: normalizeRightmoveUrl(rightmoveUrl),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing });
      void queryClient.invalidateQueries({ queryKey: queryKeys.deals });
    },
  });
}

export function useAnalysisJob(jobId: string | null) {
  const { getIdToken } = useAuth();
  const queryClient = useQueryClient();
  const [socketCompleted, setSocketCompleted] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const socketRef = useRef<AnalysisSocket | null>(null);

  useEffect(() => {
    setSocketCompleted(false);
    startedAtRef.current = jobId ? Date.now() : null;
  }, [jobId]);

  const handleSocketUpdate = useCallback(
    (message: JobSocketMessage) => {
      if (message.type !== 'DEAL_UPDATE' || !jobId || message.jobId !== jobId) {
        return;
      }
      setSocketCompleted(true);
      queryClient.setQueryData<AnalyseStatusResponse>(
        queryKeys.analysis(jobId),
        (current) =>
          current
            ? {
                ...current,
                status: 'COMPLETED',
                scores: message.scores,
              }
            : current,
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.analysis(jobId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.deals });
      void queryClient.invalidateQueries({ queryKey: queryKeys.deal(jobId) });
    },
    [jobId, queryClient],
  );

  useEffect(() => {
    if (!jobId) {
      return;
    }

    let cancelled = false;
    const socket = new AnalysisSocket(handleSocketUpdate);
    socketRef.current = socket;

    void (async () => {
      const token = await getIdToken();
      if (!token || cancelled) {
        return;
      }
      try {
        await socket.connect(token);
        if (!cancelled) {
          socket.subscribe(jobId);
        }
      } catch {
        // HTTP polling remains the fallback when the socket fails.
      }
    })();

    return () => {
      cancelled = true;
      socket.close();
      socketRef.current = null;
    };
  }, [getIdToken, handleSocketUpdate, jobId]);

  return useQuery({
    queryKey: queryKeys.analysis(jobId ?? ''),
    queryFn: async () => {
      const result = await getAnalysisStatus(jobId!);
      if (result.status === 'FAILED') {
        void queryClient.invalidateQueries({ queryKey: queryKeys.billing });
      }
      return result;
    },
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      if (socketCompleted) {
        return false;
      }
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') {
        return false;
      }
      const startedAt = startedAtRef.current;
      if (startedAt && Date.now() - startedAt > MAX_POLL_MS) {
        return false;
      }
      return POLL_INTERVAL_MS;
    },
  });
}
