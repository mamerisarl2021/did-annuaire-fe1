import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AUDIT_CATEGORIES } from "../types/audit.types";

interface AuditFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  totalCount: number;
}

/**
 * Pure UI component for filtering audit logs
 * Responsive layout following the organizations feature pattern
 */
export function AuditFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  severity,
  onSeverityChange,
  totalCount,
}: AuditFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6c84]" />
          <Input
            placeholder="Search actions, users or orgs..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 border-[#dfe1e6]"
          />
        </div>

        {/* Category Filter */}
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px] h-10 border-[#dfe1e6]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {AUDIT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Severity Filter */}
        <Select value={severity} onValueChange={onSeverityChange}>
          <SelectTrigger className="w-[160px] h-10 border-[#dfe1e6]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="INFO">Info</SelectItem>
            <SelectItem value="WARNING">Warning</SelectItem>
            <SelectItem value="ERROR">Error</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
          </SelectContent>
        </Select>

        {/* Result Counter */}
        <div className="ml-auto">
          <Badge
            variant="secondary"
            className="bg-[#deebff] text-[#0052cc] hover:bg-[#deebff] border-none font-medium px-3 py-1"
          >
            {totalCount} {totalCount > 1 ? "results" : "result"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
