"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  type PasswordResetRequestFormData,
  type PasswordResetConfirmFormData,
} from "@/lib/features/auth/schemas/password-reset.schema";

interface UsePasswordResetFormReturn {
  requestForm: UseFormReturn<PasswordResetRequestFormData>;
  confirmForm: UseFormReturn<PasswordResetConfirmFormData>;
}

export function usePasswordResetForm(): UsePasswordResetFormReturn {
  const requestForm = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const confirmForm = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return { requestForm, confirmForm };
}
