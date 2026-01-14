import { useState, useCallback, useEffect } from "react";
import { authService } from "@/lib/features/auth/services/auth.service";
import { type AuthUser } from "@/lib/features/auth/types/auth.types";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";

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
      console.error("Auth check failed", error);
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
