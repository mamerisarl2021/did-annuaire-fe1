export interface BackendAPIError {
  message: string;
  code: string;
  status: number;
  errors?: Record<string, string[]>;
  extra?: Record<string, any>;
  requestId?: string;
}

export interface LegacyErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Union type for raw API error responses.
 */
export type ApiErrorResponse = BackendAPIError | LegacyErrorResponse;

export interface NormalizedApiError {
  message: string;
  code: string;
  status: number;
  fieldErrors?: Record<string, string[]>;
  extra?: Record<string, any>;
  originalError?: any;
  isNetworkError?: boolean;
}

export interface ApiError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

export type ApiResponse<T> = T;
