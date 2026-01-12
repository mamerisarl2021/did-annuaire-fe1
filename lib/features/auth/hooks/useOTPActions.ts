"use client";

import { useState, useCallback } from "react";
import { authService } from "../services/auth.service";

interface UseOTPActionsReturn {
  /** Whether OTP generation is in progress */
  isGenerating: boolean;
  /** Whether OTP verification is in progress */
  isVerifying: boolean;
  /** Whether OTP has been sent (for email method) */
  otpSent: boolean;
  /** Error message if any */
  error: string | null;
  /** Generate OTP via email */
  generateEmailOTP: () => Promise<boolean>;
  /** Verify an OTP code */
  verifyOTP: (code: string) => Promise<boolean>;
  /** Clear error state */
  clearError: () => void;
  /** Reset all state */
  reset: () => void;
}

/**
 * Hook for OTP API actions
 *
 * Single Responsibility: Manages OTP-related API calls and their states
 * - Handles generate email OTP
 * - Handles verify OTP
 * - Manages loading and error states
 *
 * Does NOT handle:
 * - Form state
 * - UI rendering
 * - Navigation
 */
export function useOTPActions(): UseOTPActionsReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate OTP and send via email
   * @returns true if successful
   */
  const generateEmailOTP = useCallback(async (): Promise<boolean> => {
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
