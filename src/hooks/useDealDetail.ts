import { useQuery } from '@tanstack/react-query';
import { getDeal } from '@/api/deals';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/hooks/queryKeys';

export function useDealDetail(dealId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.deal(dealId ?? ''),
    queryFn: () => getDeal(dealId!),
    enabled: Boolean(user && dealId),
  });
}
