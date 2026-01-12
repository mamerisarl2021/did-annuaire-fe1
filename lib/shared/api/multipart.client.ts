import { getApiUrl } from "@/lib/shared/config/endpoints";
import { ApiException } from "@/lib/shared/api/api.errors";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { type ApiErrorResponse } from "@/lib/shared/types/api.types";

interface MultipartRequestOptions {
  requiresAuth?: boolean;
  method?: "POST" | "PUT" | "PATCH";
}

export const multipartClient = {
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options: MultipartRequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, method = "POST" } = options;
    const url = getApiUrl(endpoint);

    const headers: HeadersInit = {};

    if (requiresAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse | string = await response
          .json()
          .catch(() => response.statusText);
        throw new ApiException(response.status, errorData);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException(0, "Erreur lors de l'upload du fichier");
    }
  },
};
