import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { jwtDecode } from "jwt-decode";
import {
  type LoginPayload,
  type TokenPairResponse,
  type AuthUser,
} from "@/lib/features/auth/types/auth.types";

export const authService = {
  /**
   * Login with email/password
   */
  async login(payload: LoginPayload): Promise<TokenPairResponse> {
    const response = await httpClient.post<TokenPairResponse>(API_ENDPOINTS.AUTH.LOGIN, payload, {
      requiresAuth: false,
    });

    tokenStorage.setAccessToken(response.access);
    tokenStorage.setRefreshToken(response.refresh);

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn("Logout error", error);
    } finally {
      tokenStorage.clear();
    }
  },

  /**
   * Activate account with token and password
   */
  async activateAccount(payload: {
    token: string;
    password?: string;
    re_password?: string;
    enable_otp?: boolean;
  }): Promise<any> {
    const response = await httpClient.post<any>(API_ENDPOINTS.USERS.ACTIVATE, payload);
    return response.data || response;
  },

  /**
   * Generate OTP via email
   */
  async generateEmailOTP(): Promise<void> {
    await httpClient.post(API_ENDPOINTS.USERS.OTP_GENERATE, {}, { requiresAuth: true });
  },

  /**
   * Verify OTP
   */
  async verifyOTP(otp: string): Promise<void> {
    await httpClient.post(API_ENDPOINTS.USERS.OTP_VERIFY, { otp }, { requiresAuth: true });
  },

  /**
   * Get current user from token or API
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<any>(token);
      console.log("JWT Payload:", decoded);
      console.log("Mapping role:", decoded.role);

      let role = decoded.role;
      let email = decoded.email;

      const userId = decoded.user_id || decoded.sub;

      if (!role) {
        try {
          console.log("Fetching user profile from /me endpoint");
          const response = await httpClient.get<any>(API_ENDPOINTS.USERS.ME);
          console.log("User Profile Response:", response);

          const userData = response.data || response;
          let apiRole = userData.role;
          if (apiRole && apiRole.toUpperCase() === "SUPERUSER") {
            apiRole = "SUPER_USER";
          }

          role = apiRole;

          if (!role) {
            if (userData.is_superuser) role = "SUPER_USER";
            else if (userData.is_staff) role = "ORG_ADMIN";
          }
          email = userData.email || email;
        } catch (apiError) {
          console.error("Failed to fetch user profile from me", apiError);
        }
      }

      return {
        id: userId,
        email: email,
        role: role,
        organization_id: decoded.organization_id,
        is_active: true,
      };
    } catch (error) {
      console.error("Token decode or profile fetch failed", error);
      return null;
    }
  },
};
