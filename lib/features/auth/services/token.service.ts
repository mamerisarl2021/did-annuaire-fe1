import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import { type TokenPairResponse } from "@/lib/features/auth/types/auth.types";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";

export const tokenService = {
  /**
   * Verify if a token is valid
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.VERIFY, { token }, { requiresAuth: false });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Refresh access token specifically
   */
  async refreshToken(): Promise<TokenPairResponse> {
    const refresh = tokenStorage.getRefreshToken();
    if (!refresh) throw new Error("No refresh token");

    const response = await httpClient.post<TokenPairResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh },
      { requiresAuth: false }
    );

    return response;
  },
};
