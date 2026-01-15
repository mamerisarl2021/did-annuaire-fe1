import { Badge } from "@/components/ui/badge";
import { type OrganizationStatusType } from "@/lib/types/organization-status";

interface StatusBadgeProps {
  status: OrganizationStatusType;
}

const statusConfig: Record<
  OrganizationStatusType,
  {
    label: string;
    className: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  REFUSED: {
    label: "Refused",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  },
};

export function OrganizationStatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="default" className={`font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}
