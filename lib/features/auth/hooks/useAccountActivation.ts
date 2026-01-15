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
import { ApiException } from "@/lib/shared/api/api.errors";

interface UseAccountActivationOptions {
  token: string | null;
}

interface ActivationResult {
  success: boolean;
  requiresOtp: boolean;
  qrCodeData: QRCodeData | null;
}

interface UseAccountActivationReturn {
  form: UseFormReturn<ActivateAccountFormData>;
  hasValidToken: boolean;
  isActivating: boolean;
  error: string | null;
  activateAccount: (data: ActivateAccountFormData) => Promise<ActivationResult>;
  clearError: () => void;
}

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
          enable_totp: data.enableOtp, // Mapping enableOtp from form to enable_totp for API
          code: data.code,
        });

        if (
          data.enableOtp &&
          (response?.code === "TOTP_REQUIRED" || response?.totp_qr) &&
          !data.code
        ) {
          return {
            success: true,
            requiresOtp: true,
            qrCodeData: {
              qr_code: response.totp_qr,
              secret: response.secret as string | undefined,
            },
          };
        }

        return { success: true, requiresOtp: false, qrCodeData: null };
      } catch (err) {
        let message = "Activation failed. The link may have expired.";
        if (err instanceof ApiException) {
          if (err.code === "INVITE_EXPIRED") {
            message = "This invitation link has expired. Please contact your administrator.";
          } else if (err.code === "TOTP_INVALID") {
            message = "Invalid verification code. Please check your authenticator app.";
          } else {
            message = err.message;
          }
        }
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
