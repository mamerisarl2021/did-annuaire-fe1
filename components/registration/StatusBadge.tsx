import * as React from "react";
import { Clock, CheckCircle, XCircle, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type OrganizationStatusType, STATUS_CONFIG } from "@/lib/types/organization-status";

interface StatusBadgeProps {
  status: OrganizationStatusType;
  className?: string;
  organizationName: string;
}

const ICON_MAP = {
  clock: Clock,
  check: CheckCircle,
  x: XCircle,
  pause: PauseCircle,
};

/**
 * Status Badge Component
 * Displays the organization status with icon and color
 */
export function StatusBadge({ status, organizationName, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = ICON_MAP[config.icon];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      <Icon className="size-4" />
      {config.label.replace("{organizationName}", organizationName)}
    </span>
  );
}
