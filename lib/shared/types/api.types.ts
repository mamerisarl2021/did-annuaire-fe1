export interface ApiErrorResponse {
  code?: string;
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

export type ApiResponse<T> = T;
