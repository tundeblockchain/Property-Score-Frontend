import { apiClient } from '@/api/client';
import type {
  AnalyseAcceptedResponse,
  AnalyseRequest,
  AnalyseStatusResponse,
} from '@/models';

export function startAnalysis(
  payload: AnalyseRequest,
): Promise<AnalyseAcceptedResponse> {
  return apiClient.post<AnalyseAcceptedResponse>('/api/analyse', payload);
}

export function getAnalysisStatus(jobId: string): Promise<AnalyseStatusResponse> {
  return apiClient.get<AnalyseStatusResponse>(
    `/api/analyse/${encodeURIComponent(jobId)}`,
  );
}
