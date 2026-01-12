"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/schemas/login.schema";

interface UseLoginFormOptions {
  defaultValues?: Partial<LoginFormData>;
}

interface UseLoginFormReturn {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (
    handler: (data: LoginFormData) => void | Promise<void>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Hook for orchestrating the login form
 * Provides form state and handlers without any API logic
 */
export function useLoginForm(options?: UseLoginFormOptions): UseLoginFormReturn {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      ...options?.defaultValues,
    },
    mode: "onBlur",
  });

  const onSubmit = (handler: (data: LoginFormData) => void | Promise<void>) => {
    return form.handleSubmit(handler);
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
  };
}
