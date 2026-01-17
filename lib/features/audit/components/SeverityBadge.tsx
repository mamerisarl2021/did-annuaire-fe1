import { Badge } from "@/components/ui/badge";
import { type AuditSeverity } from "../types/audit.types";

interface SeverityBadgeProps {
  severity: AuditSeverity;
}

const severityConfig: Record<
  AuditSeverity,
  {
    variant: "default" | "secondary" | "destructive" | "warning" | "success";
    label: string;
    className: string;
  }
> = {
  INFO: {
    variant: "secondary",
    label: "Info",
    className: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100",
  },
  WARNING: {
    variant: "warning",
    label: "Warning",
    className: "bg-[#fffae6] text-[#ffab00] hover:bg-[#fffae6] border-[#fffae6]",
  },
  ERROR: {
    variant: "destructive",
    label: "Error",
    className: "bg-[#ffebe6] text-[#ff5630] hover:bg-[#ffebe6] border-[#ffebe6]",
  },
  CRITICAL: {
    variant: "destructive",
    label: "Critical",
    className: "bg-[#ffebe6] text-[#ff5630] font-bold hover:bg-[#ffebe6] border-[#ff5630]",
  },
};

/**
 * Pure UI component to display Audit Severity with appropriate styling
 */
export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity] || severityConfig.INFO;

  return (
    <Badge variant={config.variant as "secondary"} className={config.className}>
      {config.label}
    </Badge>
  );
}
