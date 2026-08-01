import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckout, createPortal } from '@/api/billing';
import { queryKeys } from '@/hooks/queryKeys';
import type { CheckoutProduct } from '@/models';

export function useCheckout() {
  return useMutation({
    mutationFn: (product: CheckoutProduct) => createCheckout(product),
    onSuccess: (data) => {
      window.location.assign(data.checkoutUrl);
    },
  });
}

export function usePortal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPortal,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing });
      window.location.assign(data.portalUrl);
    },
  });
}
