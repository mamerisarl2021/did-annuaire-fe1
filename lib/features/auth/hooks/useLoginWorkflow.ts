"use client";

import { useState, useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/schemas/login.schema";
import { authService } from "../services/auth.service";
import { type AuthUser } from "../types/auth.types";
import { ApiException } from "@/lib/shared/api/api.errors";

/**
 * Login flow states
 */
export type LoginFlowStep = "CREDENTIALS" | "OTP_REQUIRED" | "SUCCESS";

interface UseLoginWorkflowOptions {
  /** Called when login is fully complete (including OTP if required) */
  onLoginComplete?: (user: AuthUser) => void;
}

interface UseLoginWorkflowReturn {
  /** Current step in the login flow */
  currentStep: LoginFlowStep;
  /** Login form instance */
  form: UseFormReturn<LoginFormData>;
  /** Current authenticated user (after successful login) */
  user: AuthUser | null;
  /** Whether login is in progress */
  isLoggingIn: boolean;
  /** Whether OTP verification is in progress */
  isVerifyingOTP: boolean;
  /** Error message */
  error: string | null;
  /** Submit credentials */
  submitCredentials: (data: LoginFormData) => Promise<void>;
  /** Verify OTP code */
  verifyOTP: (code: string) => Promise<void>;
  /** Go back to credentials step */
  goBackToCredentials: () => void;
  /** Clear error */
  clearError: () => void;
}

/**
 * Hook for managing the complete login workflow
 *
 * Single Responsibility: Login flow orchestration
 * - Handles credential submission
 * - Detects if OTP is required
 * - Handles OTP verification
 * - Returns authenticated user on success
 */
export function useLoginWorkflow({
  onLoginComplete,
}: UseLoginWorkflowOptions = {}): UseLoginWorkflowReturn {
  const [currentStep, setCurrentStep] = useState<LoginFlowStep>("CREDENTIALS");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  /**
   * Submit credentials (step 1)
   */
  const submitCredentials = useCallback(
    async (data: LoginFormData) => {
      setIsLoggingIn(true);
      setError(null);

      try {
        // Attempt login
        const response = await authService.login({
          email: data.email,
          password: data.password,
        });

        // Get current user to check if OTP is required
        const currentUser = await authService.getCurrentUser();

        if (!currentUser) {
          throw new Error("Unable to recover user profile.");
        }

        // Check if response indicates OTP is required
        // This depends on your API - adjust as needed
        const otpRequired = "otp_required" in response && response.otp_required === true;

        if (otpRequired) {
          setCurrentStep("OTP_REQUIRED");
          return;
        }

        // Login complete
        setUser(currentUser);
        setCurrentStep("SUCCESS");
        onLoginComplete?.(currentUser);
      } catch (err) {
        const message = ApiException.getMessage(err);
        setError(message);
      } finally {
        setIsLoggingIn(false);
      }
    },
    [onLoginComplete]
  );

  /**
   * Verify OTP code (step 2, if required)
   */
  const verifyOTP = useCallback(
    async (code: string) => {
      if (!code || code.length !== 6) {
        setError("Code must contain 6 digits.");
        return;
      }

      setIsVerifyingOTP(true);
      setError(null);

      try {
        await authService.verifyOTP(code);

        // Get user after OTP verification
        const currentUser = await authService.getCurrentUser();

        if (!currentUser) {
          throw new Error("Unable to retrieve user profile.");
        }

        setUser(currentUser);
        setCurrentStep("SUCCESS");
        onLoginComplete?.(currentUser);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid or expired OTP code.";
        setError(message);
      } finally {
        setIsVerifyingOTP(false);
      }
    },
    [onLoginComplete]
  );

  /**
   * Go back to credentials step
   */
  const goBackToCredentials = useCallback(() => {
    setCurrentStep("CREDENTIALS");
    setError(null);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentStep,
    form,
    user,
    isLoggingIn,
    isVerifyingOTP,
    error,
    submitCredentials,
    verifyOTP,
    goBackToCredentials,
    clearError,
  };
}
