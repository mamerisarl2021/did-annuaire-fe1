"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OTPFormData } from "@/lib/schemas/otp.schema";

interface UseOTPFormReturn {
  /** Form instance for OTP input */
  form: UseFormReturn<OTPFormData>;
  /** Reset the form */
  reset: () => void;
  /** Set a field error */
  setFieldError: (message: string) => void;
}

/**
 * Hook for managing OTP form state
 *
 * Single Responsibility: Manages the OTP input form state only
 * - Creates and configures the react-hook-form instance
 * - Provides reset and error setting utilities
 *
 * Does NOT handle:
 * - API calls
 * - Loading states
 * - Business logic
 */
export function useOTPForm(): UseOTPFormReturn {
  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp_code: "",
    },
    mode: "onBlur",
  });

  const reset = () => {
    form.reset({ otp_code: "" });
  };

  const setFieldError = (message: string) => {
    form.setError("otp_code", { message });
  };

  return {
    form,
    reset,
    setFieldError,
  };
}
