import { API_ENDPOINTS, getApiUrl } from "@/lib/shared/config/endpoints";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { logger } from "@/lib/shared/services/logger.service";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const authInterceptor = {
  async handleTokenRefresh(): Promise<boolean> {
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;

    refreshPromise = (async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        return false;
      }

      try {
        const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.REFRESH), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          tokenStorage.setAccessToken(data.access);
          if (data.refresh) tokenStorage.setRefreshToken(data.refresh);
          return true;
        }
        return false;
      } catch (error) {
        logger.error("Token refresh failed", error);
        return false;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  async retryWithNewToken(url: string, options: RequestInit): Promise<Response | null> {
    const refreshed = await this.handleTokenRefresh();

    if (!refreshed) {
      tokenStorage.clear();
      return null;
    }

    const newToken = tokenStorage.getAccessToken();
    if (!newToken) return null;

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${newToken}`);

    return fetch(url, {
      ...options,
      headers,
    });
  },
};
