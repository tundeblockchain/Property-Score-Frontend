import { apiClient } from '@/api/client';
import type {
  DealDetail,
  DealPdfResponse,
  DealsListResponse,
} from '@/models';

export function listDeals(): Promise<DealsListResponse> {
  return apiClient.get<DealsListResponse>('/api/deals');
}

export function getDeal(dealId: string): Promise<DealDetail> {
  return apiClient.get<DealDetail>(`/api/deals/${encodeURIComponent(dealId)}`);
}

export function getDealPdf(dealId: string): Promise<DealPdfResponse> {
  return apiClient.get<DealPdfResponse>(
    `/api/deals/${encodeURIComponent(dealId)}/pdf`,
  );
}
