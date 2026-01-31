import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "./SeverityBadge";
import { type AuditAction } from "../types/audit.types";
import { AuditEmptyState } from "./AuditEmptyState";
import { cn } from "@/lib/utils";

interface AuditTableProps {
  logs: AuditAction[];
  isLoading?: boolean;
  onRowClick?: (log: AuditAction) => void;
}

/**
 * Pure UI component to display Audit logs in a table
 */
export function AuditTable({ logs, isLoading, onRowClick }: AuditTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0052cc]"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return <AuditEmptyState />;
  }

  return (
    <div className="rounded-md border border-[#dfe1e6] bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-[#fafbfc]">
          <TableRow className="hover:bg-transparent border-[#dfe1e6]">
            <TableHead className="font-semibold text-[#172b4d] py-4">Timestamp</TableHead>
            <TableHead className="font-semibold text-[#172b4d]">Category</TableHead>
            <TableHead className="font-semibold text-[#172b4d]">Action</TableHead>
            <TableHead className="font-semibold text-[#172b4d]">Severity</TableHead>
            <TableHead className="font-semibold text-[#172b4d]">User</TableHead>
            <TableHead className="font-semibold text-[#172b4d]">Organization</TableHead>
            <TableHead className="font-semibold text-[#172b4d]">IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className={cn(
                "border-[#dfe1e6] hover:bg-[#f4f5f7]/50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(log)}
            >
              <TableCell className="text-[#5e6c84] text-sm whitespace-nowrap">
                {new Date(log.timestamp).toISOString().replace("T", " ").split(".")[0]}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="font-medium border-[#dfe1e6] text-[#5e6c84] bg-white uppercase text-[10px]"
                >
                  {log.category}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-[#172b4d]">{log.action}</TableCell>
              <TableCell>
                <SeverityBadge severity={log.severity} />
              </TableCell>
              <TableCell className="text-[#5e6c84] text-sm italic">
                {log.user || "System"}
              </TableCell>
              <TableCell className="text-[#5e6c84] text-sm">{log.organization || "-"}</TableCell>
              <TableCell className="text-[#5e6c84] font-mono text-xs">{log.ip || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
