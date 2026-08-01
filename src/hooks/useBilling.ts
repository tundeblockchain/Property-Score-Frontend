import { useQuery } from '@tanstack/react-query';
import { getBilling } from '@/api/billing';
import { useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/hooks/queryKeys';

export function useBilling(options?: { refetchInterval?: number | false }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.billing,
    queryFn: getBilling,
    enabled: Boolean(user),
    refetchInterval: options?.refetchInterval,
  });
}
