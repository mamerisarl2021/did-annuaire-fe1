"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { userUpdateSchema, UserUpdateFormData } from "@/lib/validations/user.schema";
import { User, UpdateUserPayload } from "../types/users.types";
import { useToast } from "@/components/ui/use-toast";
import { usersService } from "../services/users.service";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";

interface UseUserUpdateFormProps {
  user: User | null;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUserUpdateForm({ user, onSuccess, onError }: UseUserUpdateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [functions, setFunctions] = useState<string[]>([]);
  const { addToast } = useToast();

   const { data: detailedUser, isLoading: isFetching } = useQuery({
    queryKey: ["user", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) throw new Error("User ID is missing");
      return usersService.getUser(user.id);
    },
    staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
  });



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

  useEffect(() => {
    const userData = detailedUser || user;

    if (userData) {
      const userFunctions = userData.functions
        ? userData.functions.split(",").map((f) => f.trim())
        : [];
      setFunctions(userFunctions);

      form.reset({
        email: userData.email || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        phone: userData.phone || "",
        functions: userData.functions || "",
        can_publish_prod: !!userData.can_publish_prod,
        is_auditor: !!userData.is_auditor,
      });
    }
  }, [detailedUser, user, form]);

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
    setIsSubmitting(true);

    try {
      await onConfirm(user.id, data);
      addToast("User updated successfully", "success");
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update user";

      addToast(errorMessage, "error");
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isLoading: isSubmitting || isFetching,
    functions,
    handleFunctionsChange,
    handleSubmit,
  };
}
