/**
 * User Roles for the platform
 * Used for role-based access control and redirections
 */
export const UserRole = {
  SUPER_USER: "SUPER_USER",
  ORG_ADMIN: "ORG_ADMIN",
  ORG_MEMBER: "ORG_MEMBER",
  AUDITOR: "AUDITOR",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

/**
 * Dashboard routes mapped to each role
 * Centralized mapping for consistent redirections
 */
export const ROLE_DASHBOARD_ROUTES: Record<UserRoleType, string> = {
  [UserRole.SUPER_USER]: "/dashboard/super-user",
  [UserRole.ORG_ADMIN]: "/dashboard/org-admin",
  [UserRole.ORG_MEMBER]: "/dashboard/org-member",
  [UserRole.AUDITOR]: "/dashboard/auditor",
} as const;

/**
 * Get dashboard route for a specific role
 */
export function getDashboardRoute(role: UserRoleType): string {
  return ROLE_DASHBOARD_ROUTES[role];
}
