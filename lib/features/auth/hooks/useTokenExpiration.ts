"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { logger } from "@/lib/shared/services/logger.service";
import { useLogout } from "./useLogout";

/**
 * Hook to monitor token expiration and automatically logout users
 * Checks every 30 seconds if the token is expired
 */
export function useTokenExpiration() {
  const router = useRouter();
  const { logout } = useLogout();

  useEffect(() => {
    // Initial check
    const checkTokenExpiration = () => {
      if (!tokenStorage.hasTokens()) {
        logger.debug("useTokenExpiration: No tokens found, skipping check");
        return;
      }

      const isExpired = tokenStorage.isTokenExpired();
      const timeUntilExpiration = tokenStorage.getTimeUntilExpiration();

      if (isExpired) {
        logger.warn("useTokenExpiration: Access token expired, logging out");
        logout();
        return;
      }

      if (timeUntilExpiration) {
        logger.debug("useTokenExpiration: Token valid", {
          timeUntilExpiration: `${Math.floor(timeUntilExpiration / 1000)}s`,
        });
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Set up periodic checking (every 30 seconds)
    const intervalId = setInterval(checkTokenExpiration, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [logout, router]);
}
