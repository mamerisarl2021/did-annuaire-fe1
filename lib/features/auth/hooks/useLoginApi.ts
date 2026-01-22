import { useState, useCallback } from "react";
import { authService } from "../services/auth.service";
import { type LoginPayload, type AuthUser } from "../types/auth.types";
import { ApiException } from "@/lib/shared/api/api.errors";

interface LoginResponse {
  user: AuthUser | null;
  otpRequired: boolean;
  otpMethod: "email" | "totp" | null;
}

export function useLoginApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        throw new Error("Unable to recover user profile.");
      }

      const otpRequired = "otp_required" in response && response.otp_required === true;
      const method = response.otp_method || "email";

      return {
        user: currentUser,
        otpRequired,
        otpMethod: otpRequired ? method : null,
      };
    } catch (err) {
      const message = ApiException.getMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateEmailOTP = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.generateEmailOTP();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP code.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (code: string): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.verifyOTP(code);
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        throw new Error("Unable to retrieve user profile.");
      }

      return currentUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid or expired OTP code.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    login,
    generateEmailOTP,
    verifyOTP,
    isLoading,
    error,
    clearError,
  };
}
