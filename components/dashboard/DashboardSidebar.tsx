"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Building2,
  LayoutDashboard,
  Fingerprint,
  MessageSquareDot,
  GitPullRequestArrow,
  BrickWallShield,
} from "lucide-react";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { UserRole, UserRoleType } from "@/lib/types/roles";

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const allItems = [
    {
      title: "Dashboard",
      href: "/dashboard/superuser",
      icon: LayoutDashboard,
      roles: [UserRole.SUPER_USER],
    },
    {
      title: "Organizations",
      href: "/dashboard/organizations",
      icon: Building2,
      roles: [UserRole.SUPER_USER],
    },
    {
      title: "Dashboard",
      href: "/dashboard/orgadmin",
      icon: LayoutDashboard,
      roles: [UserRole.ORG_ADMIN],
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
      roles: [UserRole.SUPER_USER, UserRole.ORG_ADMIN],
    },
    {
      title: "Audit",
      href: "/dashboard/audit",
      icon: BrickWallShield,
      roles: [UserRole.ORG_ADMIN, UserRole.AUDITOR],
      //roles: [UserRole.SUPER_USER, UserRole.ORG_ADMIN, UserRole.AUDITOR],
    },
    {
      title: "Dashboard",
      href: "/dashboard/orgmember",
      icon: LayoutDashboard,
      roles: [UserRole.ORG_MEMBER],
    },
    {
      title: "DIDs",
      href: "/dashboard/dids",
      icon: Fingerprint,
      roles: [UserRole.ORG_ADMIN, UserRole.ORG_MEMBER],
      //roles: [UserRole.SUPER_USER, UserRole.ORG_ADMIN, UserRole.ORG_MEMBER],
    },
    {
      title: "Resolve DID",
      href: "/dashboard/dids/resolve",
      icon: MessageSquareDot,
      roles: [UserRole.SUPER_USER, UserRole.ORG_ADMIN, UserRole.ORG_MEMBER, UserRole.AUDITOR],
    },
    {
      title: "Publish Requests",
      href: "/dashboard/publish-requests",
      icon: GitPullRequestArrow,
      roles: [UserRole.SUPER_USER, UserRole.ORG_ADMIN],
    },
  ];

  const items = allItems.filter((item) => {
    if (!user) return false;

    // Check against all user's roles (list)
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    const hasMatchInList = userRoles.some((r) => item.roles.includes(r as UserRoleType));
    if (hasMatchInList) return true;

    // Fallback: Check against primary role
    if (user.role && item.roles.includes(user.role as UserRoleType)) return true;

    return false;
  });

  return (
    <div className={cn("pb-12 min-h-[calc(100vh-73px)] border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Administration
          </h2>
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={`${item.title}-${item.href}`}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-2 h-4 w-4",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
