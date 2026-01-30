"use client";

import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { ResolveContent } from "@/lib/features/did/components/ResolveContent";

export default function ResolvePage() {
  return (
    <RoleGuard
      allowedRoles={[
        UserRole.ORG_ADMIN,
        UserRole.ORG_MEMBER,
        UserRole.AUDITOR,
        UserRole.SUPER_USER,
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resolve DID</h1>
            <p className="text-muted-foreground mt-1">
              Verify and resolve decentralized identifiers from any organization.
            </p>
          </div>
        </div>

        <div className="px-8 pb-8">
          <ResolveContent />
        </div>
      </div>
    </RoleGuard>
  );
}
