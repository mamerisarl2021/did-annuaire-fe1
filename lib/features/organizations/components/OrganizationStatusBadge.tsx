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
  let className = "";

  switch (status) {
    case "ACTIVE":
      className = "bg-green-100 text-green-800 hover:bg-green-100";
      break;
    case "PENDING":
      className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      break;
    case "REFUSED":
      className = "bg-red-100 text-red-800 hover:bg-red-100";
      break;
    case "SUSPENDED":
      className = "bg-orange-100 text-orange-800 hover:bg-orange-100";
      break;
  }

  const label = {
    ACTIVE: "Active",
    PENDING: "Pending",
    REFUSED: "Refused",
    SUSPENDED: "Suspended",
  }[status];

  return (
    <Badge variant="outline" className={`border-0 font-medium ${className} ${variants[status]}`}>
      {label}
    </Badge>
  );
}
