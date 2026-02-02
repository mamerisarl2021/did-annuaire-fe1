"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { userUpdateSchema, UserUpdateFormData } from "@/lib/validations/user.schema";
import { User, UpdateUserPayload } from "../types/users.types";
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
  const userId = user?.id;

  const { data: detailedUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        throw new Error("No userId");
      }
      return usersService.getUser(userId);
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

  // Update form when user data is available
  useEffect(() => {
    const userData = detailedUser || user;

    if (userData) {
      const userFunctions = userData.functions
        ? userData.functions.split(",").map((f) => f.trim())
        : [];
      setFunctions(userFunctions);

      form.setValue("email", userData.email || "");
      form.setValue("first_name", userData.first_name || "");
      form.setValue("last_name", userData.last_name || "");
      form.setValue("phone", userData.phone || "");
      form.setValue("functions", userData.functions || "");
      form.setValue("can_publish_prod", !!userData.can_publish_prod);
      form.setValue("is_auditor", !!userData.is_auditor);

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
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isUserLoading,
    functions,
    handleFunctionsChange,
    handleSubmit,
  };
}
