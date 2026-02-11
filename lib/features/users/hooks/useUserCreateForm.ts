"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema, UserCreateFormData } from "@/lib/validations/user.schema";
import { CreateUserPayload } from "../types/users.types";

interface UseUserCreateFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUserCreateForm({ onSuccess, onError }: UseUserCreateFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [functions, setFunctions] = useState<string[]>([]);

  const form = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      functions: "",
      can_publish_prod: false,
      is_auditor: false,
    },
  });

  const handleFunctionsChange = (newFunctions: string[]) => {
    setFunctions(newFunctions);
    form.setValue("functions", newFunctions.join(", "), {
      shouldValidate: true,
    });
  };

  const preparePayload = (data: UserCreateFormData): CreateUserPayload => {
    return {
      email: data.email.trim(),
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      phone: data.phone.trim(),
      functions: Array.isArray(data.functions) ? data.functions.join(", ") : data.functions || "",
      can_publish_prod: data.can_publish_prod,
      is_auditor: data.is_auditor,
    };
  };

  const handleSubmit = async (
    data: UserCreateFormData,
    onConfirm: (payload: CreateUserPayload) => Promise<void>
  ) => {
    setIsLoading(true);

    try {
      const payload = preparePayload(data);
      await onConfirm(payload);
      resetForm();
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setFunctions([]);
  };

  return {
    form,
    isLoading,
    functions,
    handleFunctionsChange,
    handleSubmit,
    resetForm,
  };
}
