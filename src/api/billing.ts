import { apiClient } from '@/api/client';
import type {
  BillingSummaryResponse,
  CheckoutProduct,
  CreateCheckoutResponse,
  CreatePortalResponse,
} from '@/models';

export function getBilling(): Promise<BillingSummaryResponse> {
  return apiClient.get<BillingSummaryResponse>('/api/billing');
}

export function createCheckout(
  product: CheckoutProduct,
): Promise<CreateCheckoutResponse> {
  return apiClient.post<CreateCheckoutResponse>('/api/billing/checkout', {
    product,
    returnOrigin: window.location.origin,
  });
}

export function createPortal(): Promise<CreatePortalResponse> {
  return apiClient.post<CreatePortalResponse>('/api/billing/portal');
}
