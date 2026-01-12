import { useState } from "react";
import { authService } from "@/lib/features/auth/services/auth.service";
import { type LoginPayload } from "@/lib/features/auth/types/auth.types";
import { ApiException } from "@/lib/shared/api/api.errors";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
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
