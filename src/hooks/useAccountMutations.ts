import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  clearDeals,
  contactTeam,
  deleteAccount,
  reportBug,
} from '@/api/account';
import { queryKeys } from '@/hooks/queryKeys';
import type { ContactTeamRequest, ReportBugRequest } from '@/models';

export function useClearDeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearDeals,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.deals });
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
  });
}

export function useReportBug() {
  return useMutation({
    mutationFn: (body: ReportBugRequest) => reportBug(body),
  });
}

export function useContactTeam() {
  return useMutation({
    mutationFn: (body: ContactTeamRequest) => contactTeam(body),
  });
}
