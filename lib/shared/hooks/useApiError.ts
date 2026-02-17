"use client";

import { useState, useCallback } from "react";
import { ApiException } from "../api/api.errors";
import { useErrorToast } from "./useErrorToast";

/**
 * Hook to manage API error state in components.
 * Provides easy ways to set inline errors (Alert) or toast errors.
 */
export function useApiError() {
  const [error, setErrorState] = useState<ApiException | null>(null);
  const { showError } = useErrorToast();

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  /**
   * Set error to be displayed inline (e.g., via <ErrorAlert error={error} />)
   */
  const setInlineError = useCallback((err: unknown) => {
    if (err instanceof ApiException) {
      setErrorState(err);
    } else if (err instanceof Error || typeof err === "string") {
      setErrorState(new ApiException(0, err));
    } else {
      setErrorState(new ApiException(0, "Unknown error"));
    }
  }, []);

  /**
   * Show error as a toast immediately
   */
  const setToastError = useCallback(
    (err: unknown, title?: string) => {
      showError(err, title);
    },
    [showError]
  );

  /**
   * Set inline error AND show toast
   */
  const setBothError = useCallback(
    (err: unknown, title?: string) => {
      setInlineError(err);
      setToastError(err, title);
    },
    [setInlineError, setToastError]
  );

  return {
    error,
    setError: setInlineError, // alias for convenience
    setInlineError,
    setToastError,
    setBothError,
    clearError,
  };
}
