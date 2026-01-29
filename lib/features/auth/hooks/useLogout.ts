import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/features/auth/services/auth.service";
import { logger } from "@/lib/shared/services/logger.service";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      queryClient.setQueryData(["auth", "me"], null);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      logger.error("Logout failed in useLogout hook", error);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
  };
}
