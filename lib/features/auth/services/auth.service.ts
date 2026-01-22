import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import { jwtDecode } from "jwt-decode";
import {
  type LoginPayload,
  type TokenPairResponse,
  type AuthUser,
} from "@/lib/features/auth/types/auth.types";
import { logger } from "@/lib/shared/services/logger.service";

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
      logger.warn("Logout API call failed", { error });
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
      logger.debug("JWT token decoded", {
        userId: decoded.user_id || decoded.sub,
        email: decoded.email,
        role: decoded.role,
      });

      let role = decoded.role;
      let email = decoded.email;
      let organization_id = decoded.organization_id;
      let userId = decoded.user_id || decoded.sub;

      let organization_data: { id: string; name: string } | undefined;

      if (!role || !organization_id) {
        try {
          logger.debug("Fetching user profile from /me endpoint to resolve missing fields");
          const response = await httpClient.get<{
            data?: {
              role?: string;
              is_superuser?: boolean;
              is_staff?: boolean;
              email?: string;
              organization?: { id: string; name: string };
              full_name?: string;
              id?: string;
            };
            role?: string;
            is_superuser?: boolean;
            is_staff?: boolean;
            email?: string;
            organization?: { id: string; name: string };
          }>(API_ENDPOINTS.USERS.ME);

          logger.debug("User profile /me raw response", response);

          const userData = response.data;

          if (userData) {
            if (userData.id) userId = userData.id;
            if (userData.email) email = userData.email;

            let apiRole = userData.role;
            if (apiRole && apiRole.toUpperCase() === "SUPERUSER") {
              apiRole = "SUPER_USER";
            }

            role = apiRole || role;

            if (!role) {
              if (userData.is_superuser) role = "SUPER_USER";
              else if (userData.is_staff) role = "ORG_ADMIN";
            }

            // MAP ORGANIZATION ID
            if (userData.organization?.id) {
              organization_id = userData.organization.id;
              organization_data = userData.organization;
              logger.debug("Mapped organization_id from /me response", { organization_id });
            } else {
              logger.warn("No organization ID found in /me response data", {
                userData: JSON.stringify(userData),
              });
            }
          }
        } catch (apiError) {
          logger.error("Failed to fetch user profile from /me endpoint", apiError);
        }
      }

      const finalUser: AuthUser = {
        id: userId || "",
        email: email || "",
        role: (role || "ORG_MEMBER") as "SUPER_USER" | "ORG_ADMIN" | "ORG_MEMBER" | "AUDITOR",
        organization_id: organization_id || "",
        organization: organization_data,
        is_active: true,
        full_name: "",
      };
      return finalUser;
    } catch (error) {
      logger.error("Failed to decode JWT token or fetch user profile", error);
      return null;
    }
  },
};
