"use client";

import { useState } from "react";
import { authService } from "../services/auth.service";
import { ApiException } from "@/lib/shared/api/api.errors";
import { logger } from "@/lib/shared/services/logger.service";

interface UsePasswordResetApiReturn {
  requestReset: (email: string) => Promise<{ message: string }>;
  confirmReset: (token: string, password: string) => Promise<{ message: string }>;
  isLoading: boolean;
  error: ApiException | null;
  clearError: () => void;
}

export function usePasswordResetApi(): UsePasswordResetApiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const clearError = () => setError(null);

  const requestReset = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.requestPasswordReset({ email });
      return result;
    } catch (err) {
      const apiError = err instanceof ApiException ? err : new ApiException(0, err as any);
      logger.error("Password reset request failed", apiError);
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmReset = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.confirmPasswordReset({
        token,
        new_password: password,
      });
      return result;
    } catch (err) {
      const apiError = err instanceof ApiException ? err : new ApiException(0, err as any);
      logger.error("Password reset confirm failed", apiError);
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestReset,
    confirmReset,
    isLoading,
    error: error as any, // Cast to any to match string | null if needed, but we should update interface
    clearError,
  };
}
