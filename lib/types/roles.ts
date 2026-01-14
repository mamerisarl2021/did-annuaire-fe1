export const UserRole = {
  SUPER_USER: "SUPER_USER",
  ORG_ADMIN: "ORG_ADMIN",
  ORG_MEMBER: "ORG_MEMBER",
  AUDITOR: "AUDITOR",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const ROLE_DASHBOARD_ROUTES: Record<UserRoleType, string> = {
  [UserRole.SUPER_USER]: "/dashboard/superuser",
  [UserRole.ORG_ADMIN]: "/dashboard/orgadmin",
  [UserRole.ORG_MEMBER]: "/dashboard/orgmember",
  [UserRole.AUDITOR]: "/dashboard/auditor",
} as const;

export function getDashboardRoute(role: UserRoleType): string {
  return ROLE_DASHBOARD_ROUTES[role];
}
