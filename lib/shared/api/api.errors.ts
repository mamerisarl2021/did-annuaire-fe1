import { type ApiErrorResponse, NormalizedApiError } from "@/lib/shared/types/api.types";
import { ErrorParser } from "./error-parser";
import { ErrorMessageTranslator } from "../utils/error-messages";

export class ApiException extends Error {
  public status: number;
  public code: string;
  public fieldErrors?: Record<string, string[]>;
  public requestId?: string;
  public extra?: Record<string, any>;
  public originalError?: any;
  public isNetworkError: boolean = false;

  constructor(status: number, data: any) {
    const normalized = ErrorParser.parse(data, status);

    super(normalized.message);
    this.name = "ApiException";
    this.status = normalized.status;
    this.code = normalized.code;
    this.fieldErrors = normalized.fieldErrors;
    this.extra = normalized.extra;
    this.originalError = normalized.originalError;
    this.isNetworkError = !!normalized.isNetworkError;
    this.requestId = (data as any)?.requestId;
  }

  /**
   * Returns a user-friendly message in French if possible.
   */
  getUserMessage(): string {
    return ErrorMessageTranslator.translate(this.code, this.message);
  }

  // --- Static Helpers ---

  static isNetworkError(error: unknown): boolean {
    if (error instanceof ApiException) return error.isNetworkError;
    return error instanceof TypeError && error.message === "Failed to fetch";
  }

  static getMessage(error: unknown): string {
    if (error instanceof ApiException) {
      return error.getUserMessage();
    }

    const normalized = ErrorParser.parse(error);
    return ErrorMessageTranslator.translate(normalized.code, normalized.message);
  }

  static isAuthError(error: unknown): boolean {
    return error instanceof ApiException && (error.status === 401 || error.code === "UNAUTHORIZED");
  }

  static isValidationError(error: unknown): boolean {
    return error instanceof ApiException && (error.status === 400 || !!error.fieldErrors);
  }
}

export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 400,
  SERVER: 500,
} as const;
