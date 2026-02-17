"use client";

import { useState } from "react";
import { authService } from "../services/auth.service";
import { ApiException } from "@/lib/shared/api/api.errors";
import { logger } from "@/lib/shared/services/logger.service";

interface UsePasswordResetApiReturn {
  requestReset: (email: string) => Promise<{ message: string }>;
  confirmReset: (token: string, password: string) => Promise<{ message: string }>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function usePasswordResetApi(): UsePasswordResetApiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const requestReset = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.requestPasswordReset({ email });
      return result;
    } catch (err) {
      let message = "Une erreur est survenue. Veuillez réessayer.";

      if (err instanceof ApiException) {
        message = err.message;
      }

      logger.error("Password reset request failed", err);
      setError(message);
      throw err;
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
      let message = "La réinitialisation a échoué. Veuillez réessayer.";

      if (err instanceof ApiException) {
        if (err.code === "RESET_TOKEN_INVALID") {
          message = "Le lien de réinitialisation est invalide ou a expiré.";
        } else if (err.code === "PASSWORD_VALIDATION_FAILED") {
          message = err.message;
        } else {
          message = err.message;
        }
      }

      logger.error("Password reset confirm failed", err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestReset,
    confirmReset,
    isLoading,
    error,
    clearError,
  };
}
