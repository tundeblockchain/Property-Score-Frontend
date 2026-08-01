import { useQuery } from '@tanstack/react-query';
import { listDeals } from '@/api/deals';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/hooks/queryKeys';

export function useDeals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.deals,
    queryFn: listDeals,
    enabled: Boolean(user),
  });
}
