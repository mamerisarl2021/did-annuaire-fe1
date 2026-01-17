import { ClipboardList } from "lucide-react";

/**
 * Pure UI component to display when no audit logs are found
 */
export function AuditEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-[#f4f5f7] p-6 rounded-full mb-4">
        <ClipboardList className="h-10 w-10 text-[#5e6c84] opacity-50" />
      </div>
      <h3 className="text-xl font-semibold text-[#172b4d] mb-2">No Audit Logs found</h3>
      <p className="text-[#5e6c84] max-w-md mx-auto">
        We couldn&apos;t find any audit logs matching your search criteria. Try adjusting your
        filters or search terms.
      </p>
    </div>
  );
}
