"use client";

import React from "react";
import { UsersManagementView } from "@/components/features/users/UsersManagementView";

export default function SuperUserUsersPage() {
  return (
    <div className="container mx-auto py-6">
      <UsersManagementView scope="SUPER_USER" />
    </div>
  );
}
