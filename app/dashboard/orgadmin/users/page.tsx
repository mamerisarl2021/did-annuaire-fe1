"use client";

import React from "react";
import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { UsersManagementView } from "@/components/features/users/UsersManagementView";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";

export default function OrgAdminUsersPage() {
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={[UserRole.ORG_ADMIN]}>
      <div className="container mx-auto py-6">
        <UsersManagementView scope="ORG_ADMIN" orgId={user?.organization_id} />
      </div>
    </RoleGuard>
  );
}
