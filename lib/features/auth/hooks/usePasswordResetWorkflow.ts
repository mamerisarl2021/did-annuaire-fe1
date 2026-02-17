import { useCallback, useMemo } from "react";
import { type UseFormReturn } from "react-hook-form";
import { usePasswordResetForm } from "./usePasswordResetForm";
import { usePasswordResetApi } from "./usePasswordResetApi";
import { usePasswordResetState } from "./usePasswordResetState";
import { getPasswordStrength } from "@/lib/schemas/activation.schema";
import { ApiException } from "@/lib/shared/api/api.errors";
import {
  type PasswordResetRequestFormData,
  type PasswordResetConfirmFormData,
} from "@/lib/features/auth/schemas/password-reset.schema";

interface UsePasswordResetWorkflowReturn {
  currentStep: string;
  requestForm: UseFormReturn<PasswordResetRequestFormData>;
  confirmForm: UseFormReturn<PasswordResetConfirmFormData>;
  isLoading: boolean;
  error: string | null;
  passwordStrength: ReturnType<typeof getPasswordStrength>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (password: string, token?: string) => Promise<void>;
  goBackToRequest: () => void;
  clearError: () => void;
}

export function usePasswordResetWorkflow(): UsePasswordResetWorkflowReturn {
  const { requestForm, confirmForm } = usePasswordResetForm();
  const api = usePasswordResetApi();
  const state = usePasswordResetState();

  // Watch password for strength indicator
  const password = confirmForm.watch("password") || "";
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      try {
        await api.requestReset(email);
        state.goToRequestSuccess();
      } catch {
        // Error already handled in api hook
      }
    },
    [api, state]
  );

  const confirmPasswordReset = useCallback(
    async (password: string, token?: string) => {
      try {
        const resetToken = token || state.token;
        if (!resetToken) {
          throw new Error("Token manquant");
        }

        await api.confirmReset(resetToken, password);
        state.goToSuccess();
      } catch (err) {
        // Check if token is invalid
        if (err instanceof ApiException && err.code === "RESET_TOKEN_INVALID") {
          state.goToTokenInvalid();
        }
        // Error already handled in api hook
      }
    },
    [api, state]
  );

  return {
    currentStep: state.currentStep,
    requestForm,
    confirmForm,
    isLoading: api.isLoading,
    error: api.error,
    passwordStrength,
    requestPasswordReset,
    confirmPasswordReset,
    goBackToRequest: state.goBackToRequest,
    clearError: api.clearError,
  };
}
