import { apiClient } from '@/api/client';
import type {
  ClearDealsResponse,
  ContactTeamRequest,
  DeleteAccountResponse,
  ReportBugRequest,
  SubmitTestimonialRequest,
  SupportSubmissionResponse,
} from '@/models';

export function clearDeals(): Promise<ClearDealsResponse> {
  return apiClient.post<ClearDealsResponse>('/api/account/clear-deals');
}

export function deleteAccount(): Promise<DeleteAccountResponse> {
  return apiClient.post<DeleteAccountResponse>('/api/account/delete');
}

export function reportBug(
  body: ReportBugRequest,
): Promise<SupportSubmissionResponse> {
  return apiClient.post<SupportSubmissionResponse>(
    '/api/account/bug-report',
    body,
  );
}

export function contactTeam(
  body: ContactTeamRequest,
): Promise<SupportSubmissionResponse> {
  return apiClient.post<SupportSubmissionResponse>('/api/account/contact', body);
}

export function submitTestimonial(
  body: SubmitTestimonialRequest,
): Promise<SupportSubmissionResponse> {
  return apiClient.post<SupportSubmissionResponse>(
    '/api/account/testimonial',
    body,
  );
}
