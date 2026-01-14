import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { jwtDecode } from "jwt-decode";
import {
  type LoginPayload,
  type TokenPairResponse,
  type AuthUser,
} from "@/lib/features/auth/types/auth.types";

/**
 * Response type for login that may include OTP requirement
 */
interface LoginResponse extends TokenPairResponse {
  otp_required?: boolean;
  otp_method?: "email" | "totp";
}

export const authService = {
  /**
   * Login with email/password
   * Returns tokens and optionally otp_required flag
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload, {
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
      const refreshToken = tokenStorage.getRefreshToken();
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refresh: refreshToken });
    } catch (error) {
      console.warn("Logout error", error);
    } finally {
      tokenStorage.clear();
    }
  },

  /**
   * Activate account with token and password
   * Returns totp_qr if enable_totp was true
   */
  async activateAccount(payload: {
    token: string;
    password?: string;
    re_password?: string;
    enable_totp?: boolean;
    code?: string;
  }): Promise<{ message?: string; totp_qr?: string; secret?: string; code?: string }> {
    const response = await httpClient.post<{
      message?: string;
      code?: string;
      data?: {
        totp_qr?: string;
        secret?: string;
        user?: { email: string; full_name: string };
        access?: string;
        refresh?: string;
      };
      access?: string;
      refresh?: string;
    }>(
      API_ENDPOINTS.USERS.ACTIVATE,
      {
        token: payload.token,
        password: payload.password,
        enable_totp: payload.enable_totp ?? false,
        code: payload.code,
      },
      { requiresAuth: false }
    );

    // Extract QR code from nested data if present
    const data = response.data;

    // Check and store tokens if present (in root or data)
    const accessToken = response.access || data?.access;
    const refreshToken = response.refresh || data?.refresh;

    if (accessToken) {
      tokenStorage.setAccessToken(accessToken);
    }
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken);
    }
    return {
      message: response.message,
      code: response.code,
      totp_qr: data?.totp_qr,
      secret: data?.secret,
    };
  },

  /**
   * Verify OTP code during activation (no auth required)
   * Body: { otp: string } only
   */
  async verifyActivationOTP(code: string): Promise<void> {
    await httpClient.post(API_ENDPOINTS.USERS.OTP_VERIFY, { code: code });
  },

  /**
   * Generate OTP and send via email
   * Requires authentication
   */
  async generateEmailOTP(): Promise<void> {
    await httpClient.post(API_ENDPOINTS.USERS.OTP_GENERATE, {}, { requiresAuth: true });
  },

  /**
   * Verify OTP (email-based)
   * Requires authentication
   */
  async verifyOTP(code: string): Promise<void> {
    await httpClient.post(API_ENDPOINTS.USERS.OTP_VERIFY, { code }, { requiresAuth: false });
  },

  /**
   * Get current user from token or API
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<{
        user_id?: string;
        sub?: string;
        email?: string;
        role?: string;
        organization_id?: string;
      }>(token);
      console.log("JWT Payload:", decoded);
      console.log("Mapping role:", decoded.role);

      let role = decoded.role;
      let email = decoded.email;

      const userId = decoded.user_id || decoded.sub;

      if (!role) {
        try {
          console.log("Fetching user profile from /me endpoint");
          const response = await httpClient.get<{
            data?: { role?: string; is_superuser?: boolean; is_staff?: boolean; email?: string };
            role?: string;
            is_superuser?: boolean;
            is_staff?: boolean;
            email?: string;
          }>(API_ENDPOINTS.USERS.ME);
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
        id: userId || "",
        email: email || "",
        role: (role || "ORG_MEMBER") as "SUPER_USER" | "ORG_ADMIN" | "ORG_MEMBER" | "AUDITOR",
        organization_id: decoded.organization_id || "",
        is_active: true,
      };
    } catch (error) {
      console.error("Token decode or profile fetch failed", error);
      return null;
    }
  },
};
