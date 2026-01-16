import { ROLE_DASHBOARD_ROUTES, type UserRoleType } from "@/lib/types/roles";

/**
 * Role-based route mapping
 * Centralized configuration for dashboard redirections
 */
export { ROLE_DASHBOARD_ROUTES };

/**
 * Get the dashboard URL for a specific role
 * @param role - The user's role
 * @returns The dashboard URL path
 */
export function getRouteForRole(role: UserRoleType): string {
  return ROLE_DASHBOARD_ROUTES[role];
}

/**
 * Check if a role requires activation flow
 * @note SUPER_USER accounts are pre-activated
 */
export function requiresActivation(role: UserRoleType): boolean {
  return role === "ORG_ADMIN";
}

/**
 * Check if a role can have OTP enabled
 * @note Only ORG_ADMIN can enable OTP
 */
export function canEnableOTP(role: UserRoleType): boolean {
  return role === "ORG_ADMIN";
}
