import { Badge } from "@/components/ui/badge";
import { type OrganizationStatusType } from "@/lib/types/organization-status";

interface StatusBadgeProps {
  status: OrganizationStatusType;
}

const variants: Record<
  OrganizationStatusType,
  "default" | "secondary" | "destructive" | "outline" | "success"
> = {
  ACTIVE: "success",
  PENDING: "secondary",
  REFUSED: "outline",
  SUSPENDED: "destructive",
};

export function OrganizationStatusBadge({ status }: StatusBadgeProps) {
  const label = {
    ACTIVE: "Active",
    PENDING: "Pending",
    REFUSED: "Refused",
    SUSPENDED: "Suspended",
  }[status];

  return (
    <Badge variant={variants[status]} className="border-0 font-medium">
      {label}
    </Badge>
  );
}
