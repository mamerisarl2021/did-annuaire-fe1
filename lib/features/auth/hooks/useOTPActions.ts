"use client";

import { useState, useCallback } from "react";
import { authService } from "../services/auth.service";
import { otpRateLimiter } from "@/lib/utils/rate-limiter";

interface UseOTPActionsReturn {
  isGenerating: boolean;
  isVerifying: boolean;
  otpSent: boolean;
  error: string | null;
  generateEmailOTP: () => Promise<boolean>;
  verifyOTP: (code: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

export function useOTPActions(): UseOTPActionsReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generateEmailOTP = useCallback(async (): Promise<boolean> => {
    const rateLimitKey = "otp_generation";
    if (!otpRateLimiter.canAttempt(rateLimitKey, 3, 120000)) {
      const remainingMs = otpRateLimiter.getRemainingTime(rateLimitKey, 120000);
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const message = `Too many OTP requests. Please wait ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''} before trying again.`;
      setError(message);
      return false;
    }

    setIsGenerating(true);
    setError(null);

    try {
      await authService.generateEmailOTP();
      setOtpSent(true);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error sending OTP code";
      setError(message);
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Verify an OTP code
   * @returns true if verification successful
   */
  const verifyOTP = useCallback(async (code: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);

    try {
      await authService.verifyOTP(code);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid OTP code";
      setError(message);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setOtpSent(false);
    setError(null);
    setIsGenerating(false);
    setIsVerifying(false);
  }, []);

  return {
    isGenerating,
    isVerifying,
    otpSent,
    error,
    generateEmailOTP,
    verifyOTP,
    clearError,
    reset,
  };
}
