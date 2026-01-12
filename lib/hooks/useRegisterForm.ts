"use client";

import { useForm, type UseFormReturn, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { registerSchema, type RegisterFormData } from "@/lib/schemas/register.schema";

interface UseRegisterFormReturn {
  form: UseFormReturn<RegisterFormData>;
  validateStep: (step: number) => Promise<boolean>;
  onSubmit: (
    handler: (data: RegisterFormData) => void | Promise<void>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  isValid: boolean;
  getStepErrors: (step: number) => FieldErrors<RegisterFormData>;
}

/**
 * Fields belonging to each step for validation
 */
const STEP_FIELDS: Record<number, (keyof RegisterFormData)[]> = {
  1: ["name", "org_type", "country", "email", "phone", "address", "allowed_email_domains"],
  2: ["admin_email", "admin_first_name", "admin_last_name", "admin_phone", "functions"],
  3: ["authorization_document", "justification_document"],
};

export function useRegisterForm(): UseRegisterFormReturn {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      org_type: "",
      country: "",
      email: "",
      phone: "",
      address: "",
      allowed_email_domains: [{ value: "" }],
      admin_email: "",
      admin_first_name: "",
      admin_last_name: "",
      admin_phone: "",
      functions: "",
      authorization_document: undefined,
      justification_document: null,
    },
    mode: "onBlur",
  });

  /**
   * Validate fields for a specific step
   */
  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const fields = STEP_FIELDS[step];
      if (!fields) return false;

      const result = await form.trigger(fields);
      return result;
    },
    [form]
  );

  /**
   * Get errors for a specific step
   */
  const getStepErrors = useCallback(
    (step: number): FieldErrors<RegisterFormData> => {
      const fields = STEP_FIELDS[step];
      if (!fields) return {};

      const allErrors = form.formState.errors;
      const stepErrors: FieldErrors<RegisterFormData> = {};

      fields.forEach((field) => {
        if (allErrors[field]) {
          stepErrors[field] = allErrors[field] as any;
        }
      });

      return stepErrors;
    },
    [form.formState.errors]
  );

  const onSubmit = (handler: (data: RegisterFormData) => void | Promise<void>) => {
    return form.handleSubmit(handler);
  };

  return {
    form,
    validateStep,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    getStepErrors,
  };
}
