import { apiClient } from '@/api/client';
import type { ClearDealsResponse, DeleteAccountResponse } from '@/models';

export function clearDeals(): Promise<ClearDealsResponse> {
  return apiClient.post<ClearDealsResponse>('/api/account/clear-deals');
}

export function deleteAccount(): Promise<DeleteAccountResponse> {
  return apiClient.post<DeleteAccountResponse>('/api/account/delete');
}
