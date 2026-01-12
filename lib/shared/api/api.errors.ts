import { type ApiErrorResponse } from "@/lib/shared/types/api.types";

export class ApiException extends Error {
  public status: number;
  public code?: string;
  public fieldErrors?: Record<string, string[]>;

  constructor(status: number, data: ApiErrorResponse | string) {
    const message =
      typeof data === "string" ? data : data.detail || data.message || "An error occurred";
    super(message);
    this.name = "ApiException";
    this.status = status;

    if (typeof data !== "string") {
      this.code = data.code;
      this.fieldErrors = data.errors;
    }
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof TypeError && error.message === "Failed to fetch";
  }

  static getMessage(error: unknown): string {
    if (error instanceof ApiException) {
      return error.message;
    }
    if (ApiException.isNetworkError(error)) {
      return "Connection error. Check your internet.";
    }
    return "An unexpected error occurred.";
  }
}

export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 400,
  SERVER: 500,
} as const;
