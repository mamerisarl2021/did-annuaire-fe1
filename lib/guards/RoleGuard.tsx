"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";
import { type UserRoleType } from "@/lib/types/roles";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRoleType[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else {
        const hasRoleMatch =
          allowedRoles.includes(user.role) ||
          (user.roles && user.roles.some((r) => allowedRoles.includes(r as UserRoleType)));

        if (!hasRoleMatch) {
          router.push("/");
        }
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  const hasRoleMatch =
    user &&
    (allowedRoles.includes(user.role) ||
      (user.roles && user.roles.some((r) => allowedRoles.includes(r as UserRoleType))));

  if (!user || !hasRoleMatch) {
    return null;
  }

  return <>{children}</>;
}
