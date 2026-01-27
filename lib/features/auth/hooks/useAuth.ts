"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/features/auth/services/auth.service";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { logger } from "@/lib/shared/services/logger.service";

/**
 * Hook to manage authentication state
 * Migrated to React Query for better caching and performance
 */
export function useAuth() {
  const {
    data: user,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      logger.debug("useAuth: Checking authentication");

      if (!tokenStorage.hasTokens()) {
        logger.debug("useAuth: No tokens found");
        return null;
      }

      try {
        logger.debug("useAuth: Fetching current user");
        const currentUser = await authService.getCurrentUser();
        logger.info("useAuth: User fetched successfully", { user: currentUser });
        return currentUser;
      } catch (error) {
        logger.error("useAuth: Failed to fetch user", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - user session doesn't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once on failure
  });

  return {
    user: user || null,
    loading,
    isAuthenticated: !!user,
    checkAuth: refetch,
  };
}
