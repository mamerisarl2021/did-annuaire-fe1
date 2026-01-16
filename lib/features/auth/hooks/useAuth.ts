import { useState, useCallback, useEffect } from "react";
import { authService } from "@/lib/features/auth/services/auth.service";
import { type AuthUser } from "@/lib/features/auth/types/auth.types";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { logger } from "@/lib/shared/services/logger.service";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      if (!tokenStorage.hasTokens()) {
        setUser(null);
        return;
      }
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      logger.error("Auth check failed in useAuth hook", error);
      setUser(null);
    } finally {
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
