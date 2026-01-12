"use client";

import { useState, useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  activateAccountSchema,
  type ActivateAccountFormData,
  type QRCodeData,
} from "../schemas/activate.schema";
import { authService } from "../services/auth.service";

interface UseAccountActivationOptions {
  /** Activation token from URL */
  token: string | null;
}

interface ActivationResult {
  success: boolean;
  requiresOtp: boolean;
  qrCodeData: QRCodeData | null;
}

interface UseAccountActivationReturn {
  /** Form instance for password setup */
  form: UseFormReturn<ActivateAccountFormData>;
  /** Whether the token is valid */
  hasValidToken: boolean;
  /** Whether activation is in progress */
  isActivating: boolean;
  /** Error message */
  error: string | null;
  /** Activate the account with password and optional OTP */
  activateAccount: (data: ActivateAccountFormData) => Promise<ActivationResult>;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Hook for account activation (password setup only)
 *
 * Single Responsibility: Account activation API call
 * Does NOT handle 2FA setup - that's useTwoFactorSetup's job
 */
export function useAccountActivation({
  token,
}: UseAccountActivationOptions): UseAccountActivationReturn {
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ActivateAccountFormData>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      enableOtp: false,
    },
    mode: "onBlur",
  });

  const hasValidToken = Boolean(token);

  /**
   * Activate the account
   * Returns QR code data if OTP was enabled
   */
  const activateAccount = useCallback(
    async (data: ActivateAccountFormData): Promise<ActivationResult> => {
      if (!token) {
        setError("Invalid or missing activation token.");
        return { success: false, requiresOtp: false, qrCodeData: null };
      }

      setIsActivating(true);
      setError(null);

      try {
        const response = await authService.activateAccount({
          token,
          password: data.password,
          re_password: data.confirmPassword,
          enable_otp: data.enableOtp,
        });

        // Check if OTP was enabled and QR code was returned
        if (data.enableOtp && response?.qr_code) {
          return {
            success: true,
            requiresOtp: true,
            qrCodeData: {
              qr_code: response.qr_code,
              secret: response.secret,
            },
          };
        }

        return { success: true, requiresOtp: false, qrCodeData: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Activation failed. The link may have expired.";
        setError(message);
        return { success: false, requiresOtp: false, qrCodeData: null };
      } finally {
        setIsActivating(false);
      }
    },
    [token]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    form,
    hasValidToken,
    isActivating,
    error,
    activateAccount,
    clearError,
  };
}
