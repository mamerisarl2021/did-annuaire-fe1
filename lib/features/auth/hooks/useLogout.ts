import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/features/auth/services/auth.service";
import { logger } from "@/lib/shared/services/logger.service";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
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
