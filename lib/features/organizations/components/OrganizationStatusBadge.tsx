import { Badge } from "@/components/ui/badge";
import { type OrganizationStatusType } from "@/lib/types/organization-status";

interface StatusBadgeProps {
  status: OrganizationStatusType;
}

const statusStyles: Record<OrganizationStatusType, string> = {
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  REFUSED: "bg-red-100 text-red-800 hover:bg-red-100",
  SUSPENDED: "bg-orange-100 text-orange-800 hover:bg-orange-100",
};

export function OrganizationStatusBadge({ status }: StatusBadgeProps) {
  const label = {
    ACTIVE: "Active",
    PENDING: "Pending",
    REFUSED: "Refused",
    SUSPENDED: "Suspended",
  }[status];

  return (
    <Badge variant="outline" className={`border-0 font-medium ${statusStyles[status]}`}>
      {label}
    </Badge>
  );
}
