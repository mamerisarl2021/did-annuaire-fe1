"use client";

import { useState, useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OTPFormData } from "@/lib/schemas/otp.schema";
import { OTPMethod, type OTPMethodType } from "@/lib/types/activation";
import { authService } from "@/lib/features/auth/services/auth.service";

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
 * Hook for OTP verification
 * Handles both TOTP and Email OTP methods
 */
export function useOTPVerification({
  method,
  onVerified,
}: UseOTPVerificationOptions): UseOTPVerificationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp_code: "",
    },
    mode: "onBlur",
  });

  /**
   * Generate OTP via email
   * Only applicable for EMAIL method
   */
  const generateEmailOTP = useCallback(async () => {
    if (method !== OTPMethod.EMAIL) return;

    setIsGenerating(true);
    setError(null);

    try {
      await authService.generateEmailOTP();
      setOtpSent(true);
      console.log("OTP email sent");
    } catch (err) {
      console.error("Failed to generate OTP:", err);
      setError("Erreur lors de l'envoi du code OTP");
    } finally {
      setIsGenerating(false);
    }
  }, [method]);

  /**
   * Verify the OTP code
   */
  const verifyOTP = useCallback(
    async (data: OTPFormData) => {
      setIsVerifying(true);
      setError(null);

      try {
        await authService.verifyOTP(data.otp_code);

        console.log("OTP verified:", data.otp_code);
        onVerified?.();
      } catch (err) {
        console.error("Failed to verify OTP:", err);
        setError("Code OTP invalide");
        form.setError("otp_code", { message: "Code OTP invalide" });
      } finally {
        setIsVerifying(false);
      }
    },
    [form, onVerified]
  );

  /**
   * Reset the OTP state
   */
  const reset = useCallback(() => {
    form.reset();
    setOtpSent(false);
    setError(null);
  }, [form]);

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
