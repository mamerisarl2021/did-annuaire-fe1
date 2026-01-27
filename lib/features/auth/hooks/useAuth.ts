"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/features/auth/services/auth.service";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { logger } from "@/lib/shared/services/logger.service";
import { QUERY_CONFIG } from "@/lib/shared/config/query.config";

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
    staleTime: QUERY_CONFIG.STALE_TIME_STANDARD,
    gcTime: QUERY_CONFIG.GC_TIME_STANDARD,
    retry: QUERY_CONFIG.RETRY_COUNT_STANDARD,
  });

  return {
    user: user || null,
    loading,
    isAuthenticated: !!user,
    checkAuth: refetch,
  };
}
