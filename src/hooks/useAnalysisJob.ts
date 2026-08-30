import { useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAnalysisStatus, startAnalysis } from '@/api/analyse';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/hooks/queryKeys';
import { useJobSocket } from '@/hooks/useJobSocket';
import {
  isValidListingUrl,
  normalizeListingUrl,
} from '@/lib/listingUrl';
import { trackAnalysisCompleteOnce, trackStartAnalysis } from '@/lib/analytics';
import type { AnalyseStatusResponse, AnalysisStrategy } from '@/models';

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_MS = 5 * 60 * 1000;

export function useStartAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      listingUrl: string;
      strategy: AnalysisStrategy;
    }) => {
      if (!isValidListingUrl(input.listingUrl)) {
        throw new Error(
          'Enter a valid Rightmove, OnTheMarket, or Zoopla property URL (e.g. https://www.rightmove.co.uk/properties/123).',
        );
      }
      return startAnalysis({
        listing_url: normalizeListingUrl(input.listingUrl),
        strategy: input.strategy,
      });
    },
    onSuccess: (_data, variables) => {
      trackStartAnalysis(variables.strategy);
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing });
      void queryClient.invalidateQueries({ queryKey: queryKeys.deals });
    },
  });
}

export function useAnalysisJob(jobId: string | null) {
  const { getIdToken } = useAuth();
  const queryClient = useQueryClient();
  const startedAtRef = useRef<{ jobId: string | null; at: number | null }>({
    jobId: null,
    at: null,
  });
  const socketCompletedRef = useRef(false);

  if (startedAtRef.current.jobId !== jobId) {
    startedAtRef.current = {
      jobId,
      at: jobId ? Date.now() : null,
    };
    socketCompletedRef.current = false;
  }

  useJobSocket(jobId, getIdToken, (message) => {
    if (message.type !== 'DEAL_UPDATE' || !jobId || message.jobId !== jobId) {
      return;
    }
    socketCompletedRef.current = true;
    const current = queryClient.getQueryData<AnalyseStatusResponse>(
      queryKeys.analysis(jobId),
    );
    trackAnalysisCompleteOnce(jobId, current?.strategy);
    queryClient.setQueryData<AnalyseStatusResponse>(
      queryKeys.analysis(jobId),
      (existing) =>
        existing
          ? {
              ...existing,
              status: 'COMPLETED',
              scores: message.scores,
            }
          : existing,
    );
    void queryClient.invalidateQueries({ queryKey: queryKeys.analysis(jobId) });
    void queryClient.invalidateQueries({ queryKey: queryKeys.deals });
    void queryClient.invalidateQueries({ queryKey: queryKeys.deal(jobId) });
  });

  return useQuery({
    queryKey: queryKeys.analysis(jobId ?? ''),
    queryFn: async () => {
      const result = await getAnalysisStatus(jobId!);
      if (result.status === 'COMPLETED') {
        trackAnalysisCompleteOnce(jobId!, result.strategy);
      }
      if (result.status === 'FAILED') {
        void queryClient.invalidateQueries({ queryKey: queryKeys.billing });
      }
      return result;
    },
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      if (socketCompletedRef.current) {
        return false;
      }
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') {
        return false;
      }
      const startedAt = startedAtRef.current.at;
      if (startedAt && Date.now() - startedAt > MAX_POLL_MS) {
        return false;
      }
      return POLL_INTERVAL_MS;
    },
  });
}
