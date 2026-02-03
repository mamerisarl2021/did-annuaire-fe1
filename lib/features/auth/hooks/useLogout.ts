import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/features/auth/services/auth.service";
import { logger } from "@/lib/shared/services/logger.service";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async (reason?: "token_expired" | "user_initiated") => {
    setIsLoading(true);
    try {
      await authService.logout();

      // Clear all query caches, not just auth
      queryClient.clear();

      if (reason === "token_expired") {
        logger.info("User logged out due to token expiration");
      } else {
        logger.info("User initiated logout");
      }

      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      logger.error("Logout failed in useLogout hook", error);
      // Even if logout API fails, clear local state and redirect
      queryClient.clear();
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
