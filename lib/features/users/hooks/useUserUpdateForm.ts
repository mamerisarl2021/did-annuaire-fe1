"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema, UserUpdateFormData } from "@/lib/validations/user.schema";
import { User, UpdateUserPayload } from "../types/users.types";
import { useToast } from "@/components/ui/use-toast";

interface UseUserUpdateFormProps {
  user: User | null;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUserUpdateForm({ user, onSuccess, onError }: UseUserUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [functions, setFunctions] = useState<string[]>([]);
  const { addToast } = useToast();

  const form = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
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

  // Initialize form when user changes
  useEffect(() => {
    if (user) {
      const userFunctions = user.functions ? user.functions.split(",").map((f) => f.trim()) : [];
      setFunctions(userFunctions);

      form.reset({
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        functions: user.functions || "",
        can_publish_prod: !!user.can_publish_prod,
        is_auditor: !!user.is_auditor,
      });
    }
  }, [user, form]);

  const handleFunctionsChange = (newFunctions: string[]) => {
    setFunctions(newFunctions);
    form.setValue("functions", newFunctions.join(", "), {
      shouldValidate: true,
    });
  };

  const handleSubmit = async (
    data: UserUpdateFormData,
    onConfirm: (userId: string, payload: UpdateUserPayload) => Promise<void>
  ) => {
    if (!user) return;
    setIsLoading(true);

    try {
      await onConfirm(user.id, data);
      addToast("User updated successfully", "success");
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update user";

      addToast(errorMessage, "error");
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    functions,
    handleFunctionsChange,
    handleSubmit,
  };
}
