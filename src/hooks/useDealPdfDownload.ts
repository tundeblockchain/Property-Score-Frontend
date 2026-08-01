import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getDealPdf } from '@/api/deals';
import { queryKeys } from '@/hooks/queryKeys';

export function useDealPdfDownload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dealId: string) => getDealPdf(dealId),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.deal(data.dealId),
      });
      window.open(data.reportUrl, '_blank', 'noopener,noreferrer');
    },
  });
}
