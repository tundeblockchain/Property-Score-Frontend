import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckout, createPortal } from '@/api/billing';
import { queryKeys } from '@/hooks/queryKeys';
import {
  rememberPendingCheckout,
  trackInitiateCheckout,
} from '@/lib/analytics';
import type { BillingPlansResponse, CheckoutProduct } from '@/models';

function catalogItemForProduct(
  catalog: BillingPlansResponse | undefined,
  product: CheckoutProduct,
) {
  if (!catalog) {
    return undefined;
  }
  return (
    catalog.subscriptionPlans.find((plan) => plan.product === product) ??
    catalog.creditPacks.find((plan) => plan.product === product)
  );
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CheckoutProduct) => createCheckout(product),
    onSuccess: (data, product) => {
      const catalog = queryClient.getQueryData<BillingPlansResponse>(
        queryKeys.billingPlans,
      );
      const item = catalogItemForProduct(catalog, product);
      const pending = {
        product,
        value: item?.priceGbp,
        contentName: item?.title,
        sessionId: data.sessionId,
      };
      rememberPendingCheckout(pending);
      trackInitiateCheckout(pending);
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
