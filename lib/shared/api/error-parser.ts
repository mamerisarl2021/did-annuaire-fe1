import { NormalizedApiError, BackendAPIError, LegacyErrorResponse } from "../types/api.types";

export class ErrorParser {
  /**
   * Parses various error response formats into a standardized NormalizedApiError.
   */
  static parse(error: unknown, status: number = 0): NormalizedApiError {
    // Default fallback
    const normalized: NormalizedApiError = {
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
      status: status || 0,
    };

    if (this.isNetworkError(error)) {
      normalized.message = "Erreur de connexion. Vérifiez votre connexion Internet.";
      normalized.code = "NETWORK_ERROR";
      normalized.isNetworkError = true;
      return normalized;
    }

    if (!error) return normalized;

    // Handle string errors
    if (typeof error === "string") {
      normalized.message = error;
      return normalized;
    }

    // Handle object errors
    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>;

      // Extract status if present in the error body itself (common in some backends)
      if (typeof err["status"] === "number") {
        normalized.status = err["status"];
      } else if (status) {
        normalized.status = status;
      }

      // 1. Try Standard BackendAPIError format
      if (this.isBackendAPIError(err)) {
        normalized.message = err.message;
        normalized.code = err.code;
        normalized.fieldErrors = this.normalizeFieldErrors(err.errors);
        normalized.extra = err.extra as Record<string, unknown> | undefined;
      }
      // 2. Try LegacyErrorResponse format
      else if (this.isLegacyErrorResponse(err)) {
        normalized.message =
          (err["detail"] as string) || (err["message"] as string) || normalized.message;
        normalized.code = (err["code"] as string) || this.inferCodeFromStatus(normalized.status);
        normalized.fieldErrors = this.normalizeFieldErrors(err["errors"]);
      }
      // 3. Last resort: generic object
      else {
        normalized.message =
          (err["message"] as string) || (err["detail"] as string) || normalized.message;
        normalized.code = (err["code"] as string) || this.inferCodeFromStatus(normalized.status);
      }

      normalized.originalError = err;
    }

    return normalized;
  }

  private static isBackendAPIError(error: unknown): error is BackendAPIError {
    return (
      typeof error === "object" &&
      error !== null &&
      typeof (error as Record<string, unknown>).message === "string" &&
      typeof (error as Record<string, unknown>).code === "string"
    );
  }

  private static isLegacyErrorResponse(error: unknown): error is LegacyErrorResponse {
    return (
      typeof error === "object" &&
      error !== null &&
      (typeof (error as Record<string, unknown>).detail === "string" ||
        typeof (error as Record<string, unknown>).message === "string" ||
        typeof (error as Record<string, unknown>).code === "string")
    );
  }

  private static isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError && error.message === "Failed to fetch") return true;
    if (
      typeof error === "object" &&
      error !== null &&
      (error as Record<string, unknown>).name === "AbortError"
    )
      return true;
    return false;
  }

  private static normalizeFieldErrors(errors: unknown): Record<string, string[]> | undefined {
    if (!errors || typeof errors !== "object" || errors === null) return undefined;

    const errs = errors as Record<string, unknown>;
    const normalized: Record<string, string[]> = {};

    for (const key in errs) {
      const value = errs[key];
      if (Array.isArray(value)) {
        normalized[key] = value.map(String);
      } else if (typeof value === "string") {
        normalized[key] = [value];
      } else if (typeof value === "object" && value !== null) {
        // Handle nested or complex error objects if necessary
        normalized[key] = [JSON.stringify(value)];
      }
    }

    return Object.keys(normalized).length > 0 ? normalized : undefined;
  }

  private static inferCodeFromStatus(status: number): string {
    if (status === 401) return "UNAUTHORIZED";
    if (status === 403) return "FORBIDDEN";
    if (status === 404) return "NOT_FOUND";
    if (status === 400) return "VALIDATION_ERROR";
    if (status >= 500) return "INTERNAL_ERROR";
    return "UNKNOWN_ERROR";
  }
}
