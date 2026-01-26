"use client";

import React from "react";
import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { UsersManagementView } from "@/components/features/users/UsersManagementView";

export default function SuperUserUsersPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_USER]}>
      <div className="container mx-auto py-6">
        <UsersManagementView scope="SUPER_USER" />
      </div>
    </RoleGuard>
  );
}
