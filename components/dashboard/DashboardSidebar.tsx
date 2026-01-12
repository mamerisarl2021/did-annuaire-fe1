"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Building2, FileText } from "lucide-react";

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const items = [
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
  ];

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Administration</h2>
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
