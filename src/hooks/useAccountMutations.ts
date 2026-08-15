import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearDeals, deleteAccount } from '@/api/account';
import { queryKeys } from '@/hooks/queryKeys';

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
