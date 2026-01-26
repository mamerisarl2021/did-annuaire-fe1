import { useState } from "react";
import { authService } from "@/lib/features/auth/services/auth.service";
import { type LoginPayload } from "@/lib/features/auth/types/auth.types";
import { ApiException } from "@/lib/shared/api/api.errors";
import { loginRateLimiter } from "@/lib/utils/rate-limiter";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    if (!loginRateLimiter.canAttempt(payload.email)) {
      const remainingMs = loginRateLimiter.getRemainingTime(payload.email);
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const errorMessage = `Too many login attempts. Please wait ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""} before trying again.`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      loginRateLimiter.reset(payload.email);
      return response;
    } catch (err) {
      const message = ApiException.getMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}
