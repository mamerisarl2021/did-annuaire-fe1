import { RoleGuard } from "@/lib/guards";
import { UserRole } from "@/lib/types/roles";
import { AuditContainer } from "@/lib/features/audit/components/AuditContainer";

/**
 * Superadmin Audit Logs Page
 */
export default function SuperadminAuditPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_USER]}>
      <AuditContainer />
    </RoleGuard>
  );
}
