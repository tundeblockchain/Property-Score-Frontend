import { apiClient } from '@/api/client';
import type {
  DealDetail,
  DealPdfResponse,
  DealsListResponse,
  RenderDealSchemeResponse,
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

function schemeRenderPath(dealId: string, schemeId: string): string {
  return `/api/deals/${encodeURIComponent(dealId)}/schemes/${encodeURIComponent(schemeId)}/render`;
}

export function getSchemeRender(
  dealId: string,
  schemeId: string,
): Promise<RenderDealSchemeResponse> {
  return apiClient.get<RenderDealSchemeResponse>(schemeRenderPath(dealId, schemeId));
}

export function postSchemeRender(
  dealId: string,
  schemeId: string,
): Promise<RenderDealSchemeResponse> {
  return apiClient.post<RenderDealSchemeResponse>(schemeRenderPath(dealId, schemeId));
}
