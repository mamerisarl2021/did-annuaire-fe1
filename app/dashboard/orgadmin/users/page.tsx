"use client";

import React from "react";
import { UsersManagementView } from "@/components/features/users/UsersManagementView";
import { useAuth } from "@/lib/features/auth/hooks/useAuth";

export default function OrgAdminUsersPage() {
    const { user } = useAuth();

    return (
        <div className="container mx-auto py-6">
            <UsersManagementView scope="ORG_ADMIN" orgId={user?.organization_id} />
        </div>
    );
}
