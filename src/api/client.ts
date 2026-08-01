import { env } from '@/config/env';
import { ApiError } from '@/lib/errors';
import type { ApiErrorBody } from '@/models';

export type TokenProvider = () => Promise<string | null>;

let getIdToken: TokenProvider = async () => null;

export function setTokenProvider(provider: TokenProvider): void {
  getIdToken = provider;
}

async function parseErrorBody(response: Response): Promise<ApiErrorBody | null> {
  try {
    const data: unknown = await response.json();
    if (
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as ApiErrorBody).error === 'string'
    ) {
      return data as ApiErrorBody;
    }
  } catch {
    // No JSON body (common for 401/403 from API Gateway).
  }
  return null;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retried = false,
): Promise<T> {
  const token = await getIdToken();
  if (!token) {
    throw new ApiError(401, 'You must be signed in to continue.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers,
  });

  if ((response.status === 401 || response.status === 403) && !retried) {
    const refreshed = await getIdToken();
    if (refreshed && refreshed !== token) {
      return request<T>(path, init, true);
    }
  }

  if (!response.ok) {
    const body = await parseErrorBody(response);
    throw new ApiError(
      response.status,
      body?.error ?? `Request failed (${response.status})`,
      body,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
};
