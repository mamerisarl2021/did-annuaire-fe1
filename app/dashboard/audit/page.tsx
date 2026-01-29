import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { AuditContainer } from "@/lib/features/audit/components/AuditContainer";

/**
 * Superadmin Audit Logs Page
 */
export default function AuditPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_USER, UserRole.ORG_ADMIN, UserRole.AUDITOR]}>
      <AuditContainer />
    </RoleGuard>
  );
}
