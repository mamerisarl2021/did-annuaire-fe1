"use client";

import { useCallback } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type OTPFormData } from "@/lib/schemas/otp.schema";
import { OTPMethod, type OTPMethodType } from "@/lib/types/activation";
import { useOTPForm } from "@/lib/features/auth/hooks/useOTPForm";
import { useOTPActions } from "@/lib/features/auth/hooks/useOTPActions";

interface UseOTPVerificationOptions {
  method: OTPMethodType;
  onVerified?: () => void;
}

interface UseOTPVerificationReturn {
  form: UseFormReturn<OTPFormData>;
  method: OTPMethodType;
  isGenerating: boolean;
  isVerifying: boolean;
  otpSent: boolean;
  error: string | null;
  generateEmailOTP: () => Promise<void>;
  verifyOTP: (data: OTPFormData) => Promise<void>;
  reset: () => void;
}

/**
 * Composite hook for OTP verification flow
 *
 * Single Responsibility: Orchestrates OTP verification by composing:
 * - useOTPForm: Form state management
 * - useOTPActions: API calls and loading states
 *
 * This is a facade hook that combines lower-level hooks
 * for backward compatibility with existing consumers.
 */
export function useOTPVerification({
  method,
  onVerified,
}: UseOTPVerificationOptions): UseOTPVerificationReturn {
  const { form, reset: resetForm, setFieldError } = useOTPForm();
  const {
    isGenerating,
    isVerifying,
    otpSent,
    error,
    generateEmailOTP: generateOTP,
    verifyOTP: verifyCode,
    reset: resetActions,
  } = useOTPActions();

  /**
   * Generate OTP via email
   * Only applicable for EMAIL method
   */
  const generateEmailOTP = useCallback(async () => {
    if (method !== OTPMethod.EMAIL) return;
    await generateOTP();
  }, [method, generateOTP]);

  /**
   * Verify the OTP code and trigger callback on success
   */
  const verifyOTP = useCallback(
    async (data: OTPFormData) => {
      const success = await verifyCode(data.otp_code);
      if (success) {
        onVerified?.();
      } else {
        setFieldError("Code OTP invalide");
      }
    },
    [verifyCode, onVerified, setFieldError]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    resetForm();
    resetActions();
  }, [resetForm, resetActions]);

  return {
    form,
    method,
    isGenerating,
    isVerifying,
    otpSent,
    error,
    generateEmailOTP,
    verifyOTP,
    reset,
  };
}
