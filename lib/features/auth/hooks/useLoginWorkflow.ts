"use client";

import { useCallback } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type LoginFormData } from "@/lib/schemas/login.schema";
import { type AuthUser } from "../types/auth.types";
import { useLoginForm } from "./useLoginForm";
import { useLoginApi } from "./useLoginApi";
import { useLoginState, type LoginFlowStep, type OTPMethod } from "./useLoginState";

interface UseLoginWorkflowOptions {
  onLoginComplete?: (user: AuthUser) => void;
}

interface UseLoginWorkflowReturn {
  currentStep: LoginFlowStep;
  form: UseFormReturn<LoginFormData>;
  user: AuthUser | null;
  isLoggingIn: boolean;
  isGeneratingOTP: boolean;
  otpSent: boolean;
  isVerifyingOTP: boolean;
  error: string | null;
  otpMethod: OTPMethod;
  submitCredentials: (data: LoginFormData) => Promise<void>;
  generateEmailOTP: () => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  goBackToCredentials: () => void;
  clearError: () => void;
}

/**
 * Orchestrates the complete login workflow
 * Composes 3 specialized hooks:
 * - useLoginForm: Form state management
 * - useLoginApi: API calls
 * - useLoginState: Step management
 */
export function useLoginWorkflow({
  onLoginComplete,
}: UseLoginWorkflowOptions = {}): UseLoginWorkflowReturn {
  const form = useLoginForm();
  const api = useLoginApi();
  const state = useLoginState();

  const submitCredentials = useCallback(
    async (data: LoginFormData) => {
      try {
        const result = await api.login({
          email: data.email,
          password: data.password,
        });

        if (result.otpRequired && result.otpMethod) {
          state.goToOTPStep(result.otpMethod);
          if (result.otpMethod === "email") {
            await api.generateEmailOTP();
            state.markOTPSent();
          }
        } else if (result.user) {
          state.goToSuccess(result.user);
          onLoginComplete?.(result.user);
        }
      } catch {
        // Error already handled in api hook
      }
    },
    [api, state, onLoginComplete]
  );

  const generateEmailOTP = useCallback(async () => {
    try {
      await api.generateEmailOTP();
      state.markOTPSent();
    } catch {
      // Error already handled in api hook
    }
  }, [api, state]);

  const verifyOTP = useCallback(
    async (code: string) => {
      if (!code || code.length !== 6) {
        return;
      }

      try {
        const user = await api.verifyOTP(code);
        state.goToSuccess(user);
        onLoginComplete?.(user);
      } catch {
        // Error already handled in api hook
      }
    },
    [api, state, onLoginComplete]
  );

  return {
    currentStep: state.currentStep,
    form,
    user: state.user,
    isLoggingIn: api.isLoading,
    isGeneratingOTP: api.isLoading,
    otpSent: state.otpSent,
    isVerifyingOTP: api.isLoading,
    error: api.error,
    otpMethod: state.otpMethod,
    submitCredentials,
    generateEmailOTP,
    verifyOTP,
    goBackToCredentials: state.goBackToCredentials,
    clearError: api.clearError,
  };
}
