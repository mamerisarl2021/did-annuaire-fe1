import { ErrorParser } from "./error-parser";
import { ErrorMessageTranslator } from "../utils/error-messages";

export class ApiException extends Error {
  public status: number;
  public code: string;
  public fieldErrors?: Record<string, string[]>;
  public requestId?: string;
  public extra?: Record<string, unknown>;
  public originalError?: unknown;
  public isNetworkErrorFlag: boolean = false;

  constructor(status: number, data: unknown, requestId?: string) {
    const normalized = ErrorParser.parse(data, status);

    super(normalized.message);
    this.name = "ApiException";
    this.status = normalized.status;
    this.code = normalized.code;
    this.fieldErrors = normalized.fieldErrors;
    this.extra = normalized.extra;
    this.originalError = normalized.originalError;
    this.isNetworkErrorFlag = !!normalized.isNetworkError;

    // Safety check for data if it's an object
    const dataObj =
      typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
    this.requestId = requestId || (dataObj["requestId"] as string);
  }

  /**
   * Returns a user-friendly message in French if possible.
   */
  public getUserMessage(): string {
    return ErrorMessageTranslator.translate(this.code, this.message);
  }

  public hasFieldErrors(): boolean {
    return !!this.fieldErrors && Object.keys(this.fieldErrors).length > 0;
  }

  public getFieldError(name: string): string | undefined {
    return this.fieldErrors?.[name]?.[0];
  }

  public isValidationError(): boolean {
    return this.status === 400 || this.code === "VALIDATION_ERROR";
  }

  public isAuthError(): boolean {
    return this.status === 401 || this.code === "UNAUTHORIZED";
  }

  public isForbiddenError(): boolean {
    return this.status === 403 || this.code === "FORBIDDEN";
  }

  public isNotFoundError(): boolean {
    return this.status === 404 || this.code === "NOT_FOUND";
  }

  public isServerError(): boolean {
    return this.status >= 500;
  }

  public isNetworkError(): boolean {
    return this.code === "NETWORK_ERROR" || this.isNetworkErrorFlag;
  }

  /**
   * Standard way to extract message from any error object
   */
  static getMessage(error: unknown): string {
    if (error instanceof ApiException) {
      return error.getUserMessage();
    }

    if (error instanceof Error) {
      return error.message;
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

  /**
   * Returns debug info for developers
   */
  public getDebugInfo() {
    return {
      code: this.code,
      status: this.status,
      requestId: this.requestId,
      fieldErrors: this.fieldErrors,
      extra: this.extra,
    };
  }
}

export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 400,
  SERVER: 500,
} as const;
