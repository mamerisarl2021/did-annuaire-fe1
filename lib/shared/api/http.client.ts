import { getApiUrl } from "@/lib/shared/config/endpoints";
import { ApiException } from "@/lib/shared/api/api.errors";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { type ApiErrorResponse } from "@/lib/shared/types/api.types";
import { authInterceptor } from "@/lib/shared/api/interceptors/auth.interceptor";

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
        // Check if token is expired before making the request
        if (tokenStorage.isTokenExpired(token)) {
          // Token is expired, trigger refresh or logout
          const retryResponse = await authInterceptor.retryWithNewToken(url, {
            ...rest,
            headers: mergedHeaders,
          });

          if (!retryResponse) {
            // Both tokens expired, clear storage and throw error
            tokenStorage.clear();
            throw new ApiException(401, "Session expired");
          }

          // Token refreshed successfully, use the new response
          const response = retryResponse;

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
        }

        (mergedHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }

    try {
      let response = await fetch(url, {
        ...rest,
        headers: mergedHeaders,
      });

      if (response.status === 401 && requiresAuth) {
        const retryResponse = await authInterceptor.retryWithNewToken(url, {
          ...rest,
          headers: mergedHeaders,
        });

        if (!retryResponse) {
          throw new ApiException(401, "Session expired");
        }

        response = retryResponse;
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

      throw new ApiException(0, "Network error or server unavailable");
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
