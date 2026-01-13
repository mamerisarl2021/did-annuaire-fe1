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
export type LoginFlowStep = "CREDENTIALS" | "EMAIL_OTP_REQUIRED" | "TOTP_REQUIRED" | "SUCCESS";

/**
 * OTP method types
 */
export type OTPMethod = "email" | "totp" | null;

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
  /** Whether OTP generation is in progress */
  isGeneratingOTP: boolean;
  /** Whether OTP has been sent */
  otpSent: boolean;
  /** Whether OTP verification is in progress */
  isVerifyingOTP: boolean;
  /** Error message */
  error: string | null;
  /** OTP method required */
  otpMethod: OTPMethod;
  /** Submit credentials */
  submitCredentials: (data: LoginFormData) => Promise<void>;
  /** Generate email OTP */
  generateEmailOTP: () => Promise<void>;
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
 * - Detects if OTP is required (email or TOTP)
 * - Handles OTP generation (for email method)
 * - Handles OTP verification
 * - Returns authenticated user on success
 */
export function useLoginWorkflow({
  onLoginComplete,
}: UseLoginWorkflowOptions = {}): UseLoginWorkflowReturn {
  const [currentStep, setCurrentStep] = useState<LoginFlowStep>("CREDENTIALS");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGeneratingOTP, setIsGeneratingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpMethod, setOtpMethod] = useState<OTPMethod>(null);

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
        const otpRequired = "otp_required" in response && response.otp_required === true;
        const method = response.otp_method || "email";
        if (otpRequired) {
          setOtpMethod(method);
          if (method === "totp") {
            setCurrentStep("TOTP_REQUIRED");
          } else {
            setCurrentStep("EMAIL_OTP_REQUIRED");
            await generateEmailOTP();
          }
          return;
        }

        // Login complete (no OTP required)
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
   * Generate email OTP (for email method)
   */
  const generateEmailOTP = useCallback(async () => {
    setIsGeneratingOTP(true);
    setError(null);

    try {
      await authService.generateEmailOTP();
      setOtpSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP code.";
      setError(message);
    } finally {
      setIsGeneratingOTP(false);
    }
  }, []);

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
    setOtpSent(false);
    setOtpMethod(null);
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
    isGeneratingOTP,
    otpSent,
    isVerifyingOTP,
    error,
    otpMethod,
    submitCredentials,
    generateEmailOTP,
    verifyOTP,
    goBackToCredentials,
    clearError,
  };
}
