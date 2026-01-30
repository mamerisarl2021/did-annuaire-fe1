"use client";

import { useEffect, useMemo } from "react";
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

  const hasRoleMatch = useMemo(() => {
    if (!user) return false;

    return (
      allowedRoles.includes(user.role) ||
      user.roles?.some((r) => allowedRoles.includes(r as UserRoleType))
    );
  }, [user, allowedRoles]);

  useEffect(() => {
    if (loading) return;

    if (!user || !hasRoleMatch) {
      router.replace("/");
    }
  }, [loading, user, hasRoleMatch, router]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!user || !hasRoleMatch) {
    return null;
  }

  return <>{children}</>;
}
