export interface BackendAPIError {
  message: string;
  code: string;
  status?: number;
  errors?: any;
  extra?: Record<string, any>;
}

export interface LegacyErrorResponse {
  code?: string;
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

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
