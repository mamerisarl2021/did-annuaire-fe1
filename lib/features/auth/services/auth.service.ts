import { httpClient } from "@/lib/shared/api/http.client";
import { API_ENDPOINTS } from "@/lib/shared/config/endpoints";
import { tokenStorage } from "@/lib/features/auth/utils/token.storage";
import {
  type LoginPayload,
  type TokenPairResponse,
  type AuthUser,
} from "@/lib/features/auth/types/auth.types";
import { logger } from "@/lib/shared/services/logger.service";
import { authMapper } from "../mappers/auth.mapper";

interface LoginResponse extends TokenPairResponse {
  otp_required?: boolean;
  otp_method?: "email" | "totp";
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload, {
      requiresAuth: false,
    });

    tokenStorage.setAccessToken(response.access);
    tokenStorage.setRefreshToken(response.refresh);

    return response;
  },

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

    const data = response.data;
    const accessToken = response.access || data?.access;
    const refreshToken = response.refresh || data?.refresh;

    if (accessToken) tokenStorage.setAccessToken(accessToken);
    if (refreshToken) tokenStorage.setRefreshToken(refreshToken);

    return {
      message: response.message,
      code: response.code,
      totp_qr: data?.totp_qr,
      secret: data?.secret,
    };
  },

  async verifyActivationOTP(code: string): Promise<void> {
    await httpClient.post(API_ENDPOINTS.USERS.OTP_VERIFY, { code: code });
  },

  async generateEmailOTP(): Promise<void> {
    await httpClient.post(API_ENDPOINTS.USERS.OTP_GENERATE, {}, { requiresAuth: true });
  },

  async verifyOTP(code: string): Promise<void> {
    await httpClient.post(API_ENDPOINTS.USERS.OTP_VERIFY, { code }, { requiresAuth: false });
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const jwtData = authMapper.decodeToken(token);
      let apiData;

      if (!jwtData.role || !jwtData.organization_id) {
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
        apiData = authMapper.fromApiResponse(response);
      }

      return authMapper.mergeUserData(jwtData, apiData);
    } catch (error) {
      logger.error("Failed to get current user", error);
      return null;
    }
  },
};
