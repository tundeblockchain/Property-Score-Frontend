import { useQuery, type Query } from '@tanstack/react-query';
import { getBilling } from '@/api/billing';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/hooks/queryKeys';
import type { BillingSummaryResponse } from '@/models';

export function useBilling(options?: {
  refetchInterval?:
    | number
    | false
    | ((query: Query<BillingSummaryResponse>) => number | false);
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.billing,
    queryFn: getBilling,
    enabled: Boolean(user),
    refetchInterval: options?.refetchInterval,
  });
}
