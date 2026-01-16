"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { getRouteForRole } from "./roleRoutes";
import type { UserRoleType } from "@/lib/types/roles";
import { logger } from "@/lib/shared/services/logger.service";

interface UseRoleRedirectReturn {
  redirectToRoleDashboard: (role: UserRoleType) => void;
  getRedirectUrl: (role: UserRoleType) => string;
}

/**
 * Hook for centralized role-based redirections
 * Keeps redirect logic out of components
 */
export function useRoleRedirect(): UseRoleRedirectReturn {
  const router = useRouter();

  /**
   * Redirect user to their role-specific dashboard
   */
  const redirectToRoleDashboard = useCallback(
    (role: UserRoleType) => {
      const url = getRouteForRole(role);
      if (url) {
        router.push(url);
      } else {
        logger.error(`No dashboard route defined for role: ${role}`, undefined, { role });
        router.push("/dashboard");
      }
    },
    [router]
  );

  /**
   * Get the redirect URL without navigating
   * Useful for prefetching or displaying
   */
  const getRedirectUrl = useCallback((role: UserRoleType): string => {
    return getRouteForRole(role);
  }, []);

  return {
    redirectToRoleDashboard,
    getRedirectUrl,
  };
}
