import { useQuery } from '@tanstack/react-query';
import { getPricing } from '@/api/pricing';
import { queryKeys } from '@/hooks/queryKeys';

export function usePricing() {
  return useQuery({
    queryKey: queryKeys.pricing,
    queryFn: getPricing,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
