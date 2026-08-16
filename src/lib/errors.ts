import type { ApiErrorBody } from '@/models';

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  get isInsufficientCredits(): boolean {
    return this.status === 402;
  }

  get isUnauthorized(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

const DEFAULT_USER_MESSAGE = 'Something went wrong. Please try again.';

const ANALYSIS_FAILED_MESSAGE =
  'This analysis could not be completed. Please try again with the same or another listing. If the problem continues, contact support.';

/** Raw message for logging only — do not show this in the UI. */
export function getErrorMessage(error: unknown, fallback = DEFAULT_USER_MESSAGE): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

/**
 * Safe copy for the UI. Client/validation errors (4xx) may use the API message;
 * server and unexpected errors use a generic fallback.
 */
export function getUserFacingErrorMessage(
  error: unknown,
  fallback = DEFAULT_USER_MESSAGE,
): string {
  if (error instanceof ApiError) {
    if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 402 ||
      error.status === 403 ||
      error.status === 404 ||
      error.status === 409
    ) {
      return error.message || fallback;
    }
    if (error.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (error.status === 503) {
      return 'This form is temporarily unavailable. Please try again later.';
    }
    return fallback;
  }

  if (error instanceof TypeError) {
    return 'Network error. Check your connection and try again.';
  }

  return fallback;
}

export function getUserFacingAnalysisFailureMessage(
  _errorMessage?: string | null,
): string {
  return ANALYSIS_FAILED_MESSAGE;
}

export function logError(error: unknown, context?: string): void {
  if (context) {
    console.error(context, error);
    return;
  }
  console.error(error);
}
