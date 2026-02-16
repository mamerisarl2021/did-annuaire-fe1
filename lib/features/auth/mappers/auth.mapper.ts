import { jwtDecode } from "jwt-decode";
import { type AuthUser } from "../types/auth.types";
import { logger } from "@/lib/shared/services/logger.service";
import { UserRoleType } from "@/lib/types";
import { UserStatus } from "../../users/types/users.types";

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
  role?: string | string[];
  is_superuser?: boolean;
  is_staff?: boolean;
  organization?: { id: string; name: string };
  full_name?: string;
  first_name?: string;
  last_name?: string;
  functions?: string[];
  status?: string;
  phone?: string;
  totp_enabled?: boolean | false;
  can_publish_prod?: boolean | false;
  last_login?: string;
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

  normalizeRole(role?: string | string[]): UserRoleType {
    if (!role) return "ORG_MEMBER";

    // Handle array format from backend
    if (Array.isArray(role)) {
      if (role.length === 0) return "SUPER_USER";

      // Map each role to our normalized standard
      const normalizedRoles = role.map((r) => this.normalizeSingleRole(r));

      // Priority: SUPER_USER, ORG_ADMIN, ORG_MEMBER, AUDITOR
      if (normalizedRoles.includes("SUPER_USER")) return "SUPER_USER";
      if (normalizedRoles.includes("ORG_ADMIN")) return "ORG_ADMIN";
      if (normalizedRoles.includes("ORG_MEMBER")) return "ORG_MEMBER";
      if (normalizedRoles.includes("AUDITOR")) return "AUDITOR";

      return "ORG_MEMBER";
    }

    return this.normalizeSingleRole(role);
  },

  /**
   * Internal helper to normalize a single role string
   */
  normalizeSingleRole(role: string): UserRoleType {
    const normalized = role.toUpperCase();
    if (normalized === "SUPERUSER" || normalized === "SUPER_USER") return "SUPER_USER";
    if (normalized === "ORG_ADMIN") return "ORG_ADMIN";
    if (normalized === "ORG_MEMBER") return "ORG_MEMBER";
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
        roles: jwtData.role ? [jwtData.role] : [],
        organization_id: jwtData.organization_id || "",
        is_active: true,
        full_name: "",
        totp_enabled: false,
        can_publish_prod: false,
      };
    }

    const role = apiData.role
      ? this.normalizeRole(apiData.role)
      : apiData.is_superuser || apiData.is_staff
        ? this.inferRoleFromFlags(apiData.is_superuser, apiData.is_staff)
        : jwtData.role || "ORG_MEMBER";

    // Ensure we have a list of normalized roles for easier UI checks
    let normalizedRoles: string[] = [];
    if (Array.isArray(apiData.role)) {
      if (apiData.role.length === 0 && role === "SUPER_USER") {
        normalizedRoles = ["SUPER_USER"];
      } else {
        // Map EACH role to our internal standards
        normalizedRoles = apiData.role.map((r) => this.normalizeSingleRole(r));
      }
    } else if (apiData.role) {
      normalizedRoles = [this.normalizeSingleRole(apiData.role)];
    } else if (role) {
      normalizedRoles = [role];
    }

    const organizationId = apiData.organization?.id || jwtData.organization_id || "";

    if (!organizationId && role !== "SUPER_USER") {
      logger.warn("No organization ID found for non-superuser", { apiData });
    }

    // Final safeguard: ensure roles array contains at least the primary role
    if ((!normalizedRoles || normalizedRoles.length === 0) && role) {
      normalizedRoles = [role];
    }

    // Remove duplicates and logs
    normalizedRoles = Array.from(new Set(normalizedRoles));

    const fullName = apiData.full_name || 
      (apiData.first_name && apiData.last_name 
        ? `${apiData.first_name} ${apiData.last_name}`.trim() 
        : apiData.first_name || apiData.last_name || "");

    return {
      id: apiData.id || jwtData.id || "",
      email: apiData.email || jwtData.email || "",
      role,
      roles: normalizedRoles,
      organization_id: organizationId,
      organization: apiData.organization,
      is_active: true,
      full_name: fullName,
      functions: apiData.functions,
      status: apiData.status as UserStatus,
      phone: apiData.phone,
      totp_enabled: apiData.totp_enabled,
      can_publish_prod: apiData.can_publish_prod,
      last_login: apiData.last_login,
    };
  },

  fromApiResponse(
    response: { data?: UserApiResponse } | UserApiResponse
  ): UserApiResponse | undefined {
    return "data" in response && response.data ? response.data : (response as UserApiResponse);
  },
};
