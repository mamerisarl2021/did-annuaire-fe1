import { useState, useCallback, useEffect } from "react";
import { authService } from "@/lib/features/auth/services/auth.service";
import { type AuthUser } from "@/lib/features/auth/types/auth.types";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { logger } from "@/lib/shared/services/logger.service";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    logger.debug("useAuth: checkAuth initiated");
    try {
      const hasTokens = tokenStorage.hasTokens();
      logger.debug("useAuth: hasTokens check", { hasTokens });

      if (!tokenStorage.hasTokens()) {
        logger.debug("useAuth: No tokens, user set to null");
        setUser(null);
        return;
      }

      logger.debug("useAuth: Requesting user from authService...");
      const currentUser = await authService.getCurrentUser();
      logger.info("useAuth: User fetched successfully", { user: currentUser });
      setUser(currentUser);
    } catch (error) {
      logger.error("useAuth: checkAuth failed", error);
      setUser(null);
    } finally {
      logger.debug("useAuth: checkAuth finished (setting loading false)");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    checkAuth,
  };
}
