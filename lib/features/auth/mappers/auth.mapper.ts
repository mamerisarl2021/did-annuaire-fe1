import { jwtDecode } from "jwt-decode";
import { type AuthUser } from "../types/auth.types";
import { logger } from "@/lib/shared/services/logger.service";
import { UserRoleType } from "@/lib/types";

interface JWTPayload {
  user_id?: string;
  sub?: string;
  email?: string;
  role?: string;
  organization_id?: string;
}

interface UserApiResponse {
  id?: string;
  email?: string;
  role?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  organization?: { id: string; name: string };
  full_name?: string;
}

export const authMapper = {
  /**
   * Decode JWT token for UI purposes only
   *
   * @param token - JWT token string
   * @returns Partial user data extracted from token payload
   */
  decodeToken(token: string): Partial<AuthUser> {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      logger.debug("JWT token decoded", {
        userId: decoded.user_id || decoded.sub,
        email: decoded.email,
        role: decoded.role,
      });

      return {
        id: decoded.user_id || decoded.sub || "",
        email: decoded.email || "",
        role: this.normalizeRole(decoded.role),
        organization_id: decoded.organization_id || "",
      };
    } catch (error) {
      logger.error("Failed to decode JWT token", error);
      throw error;
    }
  },

  normalizeRole(role?: string): UserRoleType {
    if (!role) return "ORG_MEMBER";
    const normalized = role.toUpperCase();
    if (normalized === "SUPERUSER") return "SUPER_USER";
    if (normalized === "SUPER_USER") return "SUPER_USER";
    if (normalized === "ORG_ADMIN") return "ORG_ADMIN";
    if (normalized === "AUDITOR") return "AUDITOR";
    return "ORG_MEMBER";
  },

  inferRoleFromFlags(isSuperuser?: boolean, isStaff?: boolean): UserRoleType {
    if (isSuperuser) return "SUPER_USER";
    if (isStaff) return "ORG_ADMIN";
    return "ORG_MEMBER";
  },

  mergeUserData(jwtData: Partial<AuthUser>, apiData?: UserApiResponse): AuthUser {
    if (!apiData) {
      return {
        id: jwtData.id || "",
        email: jwtData.email || "",
        role: jwtData.role || "ORG_MEMBER",
        organization_id: jwtData.organization_id || "",
        is_active: true,
        full_name: "",
      };
    }

    const role = apiData.role
      ? this.normalizeRole(apiData.role)
      : apiData.is_superuser || apiData.is_staff
        ? this.inferRoleFromFlags(apiData.is_superuser, apiData.is_staff)
        : jwtData.role || "ORG_MEMBER";

    const organizationId = apiData.organization?.id || jwtData.organization_id || "";

    if (!organizationId && role !== "SUPER_USER") {
      logger.warn("No organization ID found for non-superuser", { apiData });
    }

    return {
      id: apiData.id || jwtData.id || "",
      email: apiData.email || jwtData.email || "",
      role,
      organization_id: organizationId,
      organization: apiData.organization,
      is_active: true,
      full_name: apiData.full_name || "",
    };
  },

  fromApiResponse(
    response: { data?: UserApiResponse } | UserApiResponse
  ): UserApiResponse | undefined {
    return "data" in response && response.data ? response.data : (response as UserApiResponse);
  },
};
