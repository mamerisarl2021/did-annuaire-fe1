"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Building2, FileText, LayoutDashboard, Fingerprint } from "lucide-react";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const allItems = [
    {
      title: "Overview",
      href: "/dashboard/superuser",
      icon: LayoutDashboard,
      roles: ["SUPER_USER"],
    },
    {
      title: "Organizations",
      href: "/dashboard/superuser",
      icon: Building2,
      roles: ["SUPER_USER"],
    },
    {
      title: "Users",
      href: "/dashboard/superuser/users",
      icon: Users,
      roles: ["SUPER_USER"],
    },
    {
      title: "Logs",
      href: "/dashboard/superuser/logs",
      icon: FileText,
      roles: ["SUPER_USER"],
    },

    {
      title: "Overview",
      href: "/dashboard/orgadmin",
      icon: LayoutDashboard,
      roles: ["ORG_ADMIN"],
    },
    {
      title: "Organizations",
      href: "/dashboard/orgadmin/organizations",
      icon: Building2,
      roles: ["ORG_ADMIN"],
    },
    {
      title: "Users",
      href: "/dashboard/orgadmin/users",
      icon: Users,
      roles: ["ORG_ADMIN"],
    },
    {
      title: "DIDs",
      href: "/dashboard/dids",
      icon: Fingerprint,
      roles: ["SUPER_USER", "ORG_ADMIN"],
    },
  ];

  const items = allItems.filter((item) => !user?.role || item.roles.includes(user.role));

  return (
    <div className={cn("pb-12 min-h-[calc(100vh-64px)] border-r bg-background", className)}>
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
