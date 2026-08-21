import { useQuery } from '@tanstack/react-query';
import { getBillingPlans } from '@/api/billing';
import { queryKeys } from '@/hooks/queryKeys';

export function useBillingPlans() {
  return useQuery({
    queryKey: queryKeys.billingPlans,
    queryFn: getBillingPlans,
    staleTime: 5 * 60 * 1000,
  });
}
