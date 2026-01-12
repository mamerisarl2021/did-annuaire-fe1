import { API_ENDPOINTS, getApiUrl } from "@/lib/shared/config/endpoints";
import { ApiException } from "@/lib/shared/api/api.errors";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { type ApiErrorResponse } from "@/lib/shared/types/api.types";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const httpClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, headers = {}, ...rest } = options;
    const url = getApiUrl(endpoint);

    const mergedHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (requiresAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        (mergedHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }

    try {
      let response = await fetch(url, {
        ...rest,
        headers: mergedHeaders,
      });

      if (response.status === 401 && requiresAuth) {
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          const newToken = tokenStorage.getAccessToken();
          if (newToken) {
            (mergedHeaders as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
            response = await fetch(url, {
              ...rest,
              headers: mergedHeaders,
            });
          }
        } else {
          tokenStorage.clear();
          throw new ApiException(401, "Session expirée");
        }
      }

      if (!response.ok) {
        const errorData: ApiErrorResponse | string = await response
          .json()
          .catch(() => response.statusText);
        throw new ApiException(response.status, errorData);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiException) throw error;

      throw new ApiException(0, "Erreur réseau ou serveur indisponible");
    }
  },

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function handleTokenRefresh(): Promise<boolean> {
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
      console.error("Token refresh failed", error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
