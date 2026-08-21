import { publicGet, apiClient } from '@/api/client';
import type {
  BillingPlansResponse,
  BillingSummaryResponse,
  CheckoutProduct,
  CreateCheckoutResponse,
  CreatePortalResponse,
} from '@/models';

export function getBilling(): Promise<BillingSummaryResponse> {
  return apiClient.get<BillingSummaryResponse>('/api/billing');
}

export function getBillingPlans(): Promise<BillingPlansResponse> {
  return publicGet<BillingPlansResponse>('/api/billing/plans');
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
