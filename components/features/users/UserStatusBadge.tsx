import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/lib/features/users/types/users.types";
import { cn } from "@/lib/utils";

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  UserStatus,
  { label: string; variant: "outline" | "default" | "secondary" | "destructive"; className: string }
> = {
  PENDING: {
    label: "Pending",
    variant: "outline",
    className: "border-amber-200 text-amber-700 bg-amber-50",
  },
  INVITED: {
    label: "Invited",
    variant: "secondary",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ACTIVE: {
    label: "Active",
    variant: "default",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  DEACTIVATED: {
    label: "Deactivated",
    variant: "destructive",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "font-medium uppercase tracking-wider text-[10px]",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
